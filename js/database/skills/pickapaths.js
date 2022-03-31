import { GameDatabase } from "../game-database.js";

if (!GameDatabase.skills) GameDatabase.skills = {};

GameDatabase.skills.pickapaths = {
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
        Currently: ${formatTime(player.records.sizes[30])}`
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
        Currently: ${formatTime(player.records.sizes[50])}`
    },
    fakeIPMult: {
        id: 3,
        upgrades: {
            first: {
                id: "a",
                description: `Unlock a new upgrade.`
            },
            second: {
                id: "b",
                description: "UNLOCK A NEW UPGRADE!!!!!!!!!!!!!1111"
            },
        },
        isUnlocked: () => SkillPointUpgrades.doubleBFS.canBeApplied && player.records.sizes[64] < 24000,
        unlockText: () => `Complete a 64x64 maze or larger within 24s.
        Currently: ${formatTime(player.records.sizes[64])}`
    },
    chooseCPUPair: {
        id: 4,
        upgrades: {
            first: {
                id: "power",
                description: "CPUs ^1.25.",
                effect: 1.25,
                default: 1,
                formatEffect: x => `^${x}`
            },
            second: {
                id: "multiply",
                description: "CPUs x3.",
                effect: 3,
                default: 1,
                formatEffect: x => `x${x}`
            },
        },
        isUnlocked: () => SkillPointUpgrades.doubleBFS.canBeApplied && player.records.sizes[100] < 40000,
        unlockText: () => `Complete a 100x100 maze or larger within 40s.
        Currently: ${formatTime(player.records.sizes[100])}`
    },
    searchImprovePair: {
        id: 5,
        upgrades: {
            first: {
                id: "dfs",
                description: "New technology 'Death first search' allows DFS to be x12 quicker.",
                effect: 12,
                default: 1,
                formatEffect: x => `x${x}`
            },
            second: {
                id: "bfs",
                description: `New technology 'Bread first search' processes all queued nodes at once with a
                maximum of 8 nodes.`
            },
        },
        isUnlocked: () => SkillPointUpgrades.doubleBFS.canBeApplied && player.records.sizes[30] < 1000,
        unlockText: () => `Complete a 30x30 maze or larger within 1s.
        Currently: ${formatTime(player.records.sizes[30])}`
    },
    spMultPowPair: {
        id: 6,
        upgrades: {
            first: {
                id: "power",
                description: `^1.6 Skill Points gain before multipliers, and unlock a new buyable
                [what the hell is that]. Surely nothing can go wrong?`,
                effect: 1.6,
                default: 1,
                formatEffect: x => `^${x}`
            },
            second: {
                id: "multiply",
                description: `Gain a decaying multiplier to Skill Points. NOW'S YOUR CHANCE TO BE A
                [[ability-rebuy-mechanic-owner]]`,
                effect: () => 30 * 0.4 ** (player.records.currentTime / 1000),
                default: 1,
                formatEffect: x => `x${x}`
            }
        },
        isUnlocked: () => SkillPointUpgrades.doubleBFS.canBeApplied && player.records.sizes[200] < 4000,
        unlockText: () => `Complete a 200x200 maze or larger within 4s.
        Currently: ${formatTime(player.records.sizes[200])}`
    }
};