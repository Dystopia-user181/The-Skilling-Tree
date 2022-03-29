const SkillPoints = {
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

class SkillPointUpgradeState extends BitPurchaseableState {
    get currency() { return Currency.skillPoints; }

    get bits() { return player.skills.skillBits; }

    set bits(value) { player.skills.skillBits = value; }
}

const SkillPointUpgrades = objectMapping({
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
    }
}, x => new SkillPointUpgradeState(x));