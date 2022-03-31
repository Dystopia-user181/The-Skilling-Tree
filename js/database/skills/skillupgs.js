import { GameDatabase } from "../game-database.js";

if (!GameDatabase.skills) GameDatabase.skills = {};

GameDatabase.skills.upgrades = {
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
        effect: x => (x + 1) ** PickapathUpgrades.chooseCPUPair.power.effectOrDefault()
            * PickapathUpgrades.chooseCPUPair.multiply.effectOrDefault(),
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
    },
    spMult: {
        isRebuyable: true,
        id: "spMult",
        title: "Matter Dimensions",
        description: `So this upgrade cost increases by tenfold and its effect by twofold for
        each purchase. Sounds familiar?`,
        isUnlocked: () => PickapathUpgrades.fakeIPMult.isUnlocked,
        cost: x => Math.ceil(10 ** x * 1000),
        effect: x => 2 ** x,
        formatEffect: x => `x${x} Skill Points gain`
    },
    bfsBulk: {
        isRebuyable: true,
        id: "bfsBulk",
        title: "Bred first surge",
        description: `+1 option for BFS bulk.`,
        isUnlocked: () => PickapathUpgrades.spMultPowPair.isUnlocked,
        cost: x => Math.ceil(5 ** x * 2e9),
        effect: x => x,
        formatEffect: x => `+${x} option${x === 1 ? "" : "s"}`
    }
};