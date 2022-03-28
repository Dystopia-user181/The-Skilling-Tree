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
    }
}, x => new SkillPointUpgradeState(x));