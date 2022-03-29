import { BitPurchaseableState, RebuyableMechanicState } from "../lib/index.js";

export const SkillPoints = {
    get gain() {
        let base = 1 + (player.maze.currentSize - 6) / 2;
        return base * this.multiplier;
    },

    get multiplier() {
        let multiplier = 1;
        multiplier *= SkillPointUpgrades.times2SP.effectOrDefault();
        return multiplier;
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
            description: "Unlock Breadth-first search.",
            cost: 72
        },


        decreaseSearchSpeed: {
            isRebuyable: true,
            id: "decreaseSearchSpeed",
            title: "Download More RAM",
            description: "Speed up search by a factor of (omfggg who cares?).",
            cost: x => Math.floor(1.2 ** x * 50),
            effect: x => x * 0.5 + 1
        }
    }, x => x.isRebuyable ? new SkillPointRebuyableState(x) : new SkillPointUpgradeState(x));

    upgs.singles = filter(upgs, x => x instanceof SkillPointUpgradeState);
    upgs.rebuyables = filter(upgs, x => x instanceof SkillPointRebuyableState);
    
    return upgs;
})();