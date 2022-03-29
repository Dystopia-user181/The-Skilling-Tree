import { BitPurchaseableState, RebuyableMechanicState } from "../lib/index.js";

export const SkillPoints = {
    get gain() {
        let base = 1 + (player.maze.currentSize - 6) / 2;
        return Math.floor((base * this.multiplier) ** this.power);
    },

    get multiplier() {
        let multiplier = 1;
        multiplier *= SkillPointUpgrades.times2SP.effectOrDefault();
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
        bfs: {
            id: 2,
            title: "'Puter Science",
            description: "Unlock Breadth first search.",
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
            title: "Longer (this is an unweighted graph)",
            description: `Give about 30% more connections between nodes.
                Also speeds up search by 30%. Good news for searching, bad news for you.`,
            cost: 300,
            isUnlocked: () => SkillPointUpgrades.decreaseSearchSpeed.amount >= 3,
            effect: 1.3,
            default: 1
        },
        doubleBFS: {
            id: 5,
            title: "Not Stupid",
            description: "What if we BFS from *both* sides? It'll take twice as long but it might work.",
            cost: 500,
            isUnlocked: () => SkillPointUpgrades.decreaseSearchSpeed.amount >= 3,
            onPurchase: () => Graph.newGraph()
        },
        autoReroll: {
            id: 6,
            title: "Machine Unlearning",
            description: "Searching automatically rerolls if you are stuck (why would you want to disable this)",
            cost: 15000,
            isUnlocked: () => SkillPointUpgrades.decreaseSearchSpeed.amount >= 1000
        },
        dfs: {
            id: 7,
            title: "BLS",
            description: "Breadth first search bad? Try Depth first search instead!",
            cost: 1000,
            isUnlocked: () => SkillPointUpgrades.decreaseSearchSpeed.amount >= 1000
        },


        decreaseSearchSpeed: {
            isRebuyable: true,
            id: "decreaseSearchSpeed",
            title: "Download More RAM",
            description: "Speed up search by a factor of (omfggg whoo cares?)",
            isUnlocked: () => SkillPointUpgrades.bfs.canBeApplied,
            cost: x => Math.ceil(1.1 ** x * 50),
            effect: x => x + 1,
            formatEffect: x => `x${x.toFixed(1)} times faster`
        }
    }, x => x.isRebuyable ? new SkillPointRebuyableState(x) : new SkillPointUpgradeState(x));

    upgs.singles = filter(upgs, x => x instanceof SkillPointUpgradeState);
    upgs.rebuyables = filter(upgs, x => x instanceof SkillPointRebuyableState);
    
    return upgs;
})();