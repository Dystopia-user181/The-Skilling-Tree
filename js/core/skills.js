import { GameMechanicState, BitPurchaseableState, RebuyableMechanicState } from "../lib/index.js";

export const SkillPoints = {
    get gain() {
        let base = 1 + (player.maze.currentSize - 6) / 2;
        return Math.floor((base * this.multiplier) ** this.power);
    },

    get multiplier() {
        let multiplier = 1;
        multiplier *= SkillPointUpgrades.times2SP.effectOrDefault();
        multiplier *= PickapathUpgrades.spGainPair.doubleSPGain.effectOrDefault();
        multiplier *= PickapathUpgrades.spGainPair.tripleSPGain.effectOrDefault();
        return multiplier;
    },

    get power() {
        let power = 1;
        power *= SkillPointUpgrades.raiseSPGain1.effectOrDefault();
        return power;
    }
}

export class SkillPointUpgradeState extends BitPurchaseableState {
    get currency() { return Currency.skillPoints; }

    get bits() { return player.skills.skillBits; }

    set bits(value) { player.skills.skillBits = value; }
}

export class SkillPointRebuyableState extends RebuyableMechanicState {
    get currency() { return Currency.skillPoints; }

    get rebuyableData() { return player.skills.rebuyables; }
}

export class PickapathState extends GameMechanicState {
    constructor(config) {
        super(config);
        this.bind(config.upgrades.first, config.upgrades.second);
    }

    bind(upg1, upg2) {
        const thisReference = this;
        this.first = upg1 instanceof GameMechanicState ? upg1 : new GameMechanicState(upg1);
        this.second = upg2 instanceof GameMechanicState ? upg2 : new GameMechanicState(upg2);
        Object.defineProperty(this.first, "canBeApplied", {
            get() {
                return thisReference.chosen === this && thisReference.canBeApplied;
            }
        });
        Object.defineProperty(this.second, "canBeApplied", {
            get() {
                return thisReference.chosen === this && thisReference.canBeApplied;
            }
        });
        this[this.first.id] = this.first;
        this[0] = this.first;
        this[this.second.id] = this.second;
        this[1] = this.second;
        return this;
    }

    get canBeApplied() {
        return this.isUnlocked;
    }

    get bits() { return player.skills.pickapathBits; }

    set bits(value) { player.skills.pickapathBits = value; }

    get chosen() {
        return Boolean(this.bits & (1 << this.id)) ? this.second : this.first;
    }

    choose(x) {
        if (x === PickapathState.first && this.chosen === this.second) {
            this.toggle();
            this.first.config.onChoose?.();
        } else if (x === PickapathState.second && this.chosen === this.first) {
            this.toggle();
            this.second.config.onChoose?.();
        }
    }

    toggle() {
        this.bits ^= 1 << this.id;
    }

    static first = 0;

    static second = 1;
}

export const SkillPointUpgrades = (function() {
    const upgs = objectMapping({
        times2SP: {
            id: 0,
            title: "Useless Upgrade",
            description: "Multiply Skill Points gain by x2. Very exciting!",
            cost: 5,
            effect: 2,
            default: 1
        },
        increaseMazeSize: {
            id: 1,
            title: "Not Useless",
            description: "You can increase maze size to get more skill points.",
            cost: 20
        },
        dfs: {
            id: 2,
            title: "'Puter Science",
            description: "Unlock Depth first search.",
            cost: 72
        },
        raiseSPGain1: {
            id: 3,
            title: "Please help me with balancing",
            description: "^1.3 Skill Points gain but floor it so formatting doesn't go wack. whatever.",
            cost: 150,
            isUnlocked: () => SkillPointUpgrades.decreaseSearchSpeed.amount >= 3,
            effect: 1.3,
            default: 1
        },
        moreConnections: {
            id: 4,
            title: "(but this is an unweighted graph)",
            description: `Give about 30% more connections between nodes.
                Also speeds up search by 30%.`,
            cost: 300,
            isUnlocked: () => SkillPointUpgrades.decreaseSearchSpeed.amount >= 3,
            effect: 1.3,
            default: 1
        },
        bfs: {
            id: 5,
            title: "DLS",
            description: "Depth first search bad? Try [[the other one]]!",
            cost: 500,
            isUnlocked: () => SkillPointUpgrades.decreaseSearchSpeed.amount >= 3
        },
        autoReroll: {
            id: 6,
            title: "Machine Unlearning",
            description: "Searching automatically rerolls if you are stuck. Decreases reroll cooldown to 5s.",
            cost: 1000,
            isUnlocked: () => SkillPointUpgrades.decreaseSearchSpeed.amount >= 3,
            effect: 5,
            default: 10
        },
        doubleBFS: {
            id: 7,
            title: "Not Stupid",
            description: "What if we BFS from *both* sides? It'll take twice as long but it might work.",
            cost: 2000,
            isUnlocked: () => SkillPointUpgrades.decreaseSearchSpeed.amount >= 3,
            onPurchase: () => Graph.newGraph()
        },


        decreaseSearchSpeed: {
            isRebuyable: true,
            id: "decreaseSearchSpeed",
            title: "Download More CPU",
            description: "Speed up search by a factor of (omfggg whoo cares?)",
            isUnlocked: () => SkillPointUpgrades.dfs.canBeApplied,
            cost: x => Math.ceil(1.1 ** x * 50),
            effect: x => x + 1,
            formatEffect: x => `x${x.toFixed(1)} times faster`
        },
        increaseMaxMapSize: {
            isRebuyable: true,
            id: "increaseMaxMapSize",
            title: "Download More RAM",
            description: "Increase maze size by [[redacted]]",
            isUnlocked: () => SkillPointUpgrades.bfs.canBeApplied,
            cost: x => Math.ceil(1.1 ** x * 80),
            effect: x => 2 * x,
            formatEffect: x => `+${x} maximum maze size`
        }
    }, x => x.isRebuyable ? new SkillPointRebuyableState(x) : new SkillPointUpgradeState(x));

    upgs.singles = filter(upgs, x => x instanceof SkillPointUpgradeState);
    upgs.rebuyables = filter(upgs, x => x instanceof SkillPointRebuyableState);
    
    return upgs;
})();

export const PickapathUpgrades = (function() {
    const upgs = objectMapping({
        spGainPair: {
            id: 0,
            upgrades: {
                first: {
                    id: "doubleSPGain",
                    description: "Multiply Skill Points gain by x2. Are you sure this is good?",
                    effect: 2,
                    default: 1,
                    formatEffect: x => `x${x}`
                },
                second: {
                    id: "tripleSPGain",
                    description: `Multiply Skill Points gain by x3. Except mazes which take more than 7 seconds
                    to complete don't give Skill Points.`,
                    effect: () => player.records.currentTime > 7000 ? 0 : 3,
                    default: 1,
                    formatEffect: x => `x${x}`
                },
            },
            isUnlocked: () => SkillPointUpgrades.doubleBFS.canBeApplied && player.records.sizes[30] < 10000,
            unlockText: () => `Complete a 30x30 maze or larger within 10s.
            Currently: ${(player.records.sizes[30] / 1000).toFixed(3)}s`
        },
        connectionsPair: {
            id: 1,
            upgrades: {
                first: {
                    id: "twoConnections",
                    description: `Decrease maximum distance between connections from 3 to 2. Speed up
                    search by x1.4.`,
                    effect: 1.4,
                    default: 1,
                    formatEffect: x => `x${x}`,
                    onChoose: () => Graph.newGraph()
                },
                second: {
                    id: "oneConnection",
                    description: `Decrease maximum distance between connections from 3 to 1. Speed up
                    search by x2.`,
                    effect: 2,
                    default: 1,
                    formatEffect: x => `x${x}`,
                    onChoose: () => Graph.newGraph()
                },
            },
            isUnlocked: () => SkillPointUpgrades.doubleBFS.canBeApplied && player.records.sizes[50] < 100000,
            unlockText: () => `Complete a 50x50 maze or larger within 100s.
            Currently: ${(player.records.sizes[50] / 1000).toFixed(3)}s`
        }
    }, x => new PickapathState(x));
    
    return upgs;
})();