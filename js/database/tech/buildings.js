import { GameDatabase } from "../game-database.js";

if (!GameDatabase.tech) GameDatabase.tech = {};

GameDatabase.tech.buildings = {
    cursor: {
        id: "cursor",
        name: "cursor",
        description: "We've been cursed.",
        cost: x => 1.2 ** x * 50,
        effect: x => x
    },
    fome: {
        id: "fome",
        name: "quantum fome",
        description: "No it's not foam.",
        cost: x => 1.25 ** x * 500,
        effect: x =>  5 * x,
        isUnlocked: () => TechBuildings.cursor.amount > 5
    },
    planet: {
        id: "planet",
        name: "planet",
        description: "What is this, KSP?",
        cost: x => 1.3 ** x * 2000,
        effect: x => 100 * x,
        isUnlocked: () => TechBuildings.fome.amount > 5
    },
    star: {
        id: "star",
        name: "star",
        description: "No, I am not proud of genesis in the slightest.",
        cost: x => 1.35 ** x * 5e4,
        effect: x => 400 * x,
        isUnlocked: () => TechBuildings.planet.amount > 5
    },
    skill: {
        id: "skill",
        name: "skill solution",
        description: "Channel your Skill Points into more production.",
        cost: x => 1.4 ** x * 5e5,
        effect: x => Currency.skillPoints.value / 4e7 * x,
        isUnlocked: () => TechBuildings.star.amount > 3
    },
    galaxy: {
        id: "galaxy",
        name: "galaxy",
        description: "The antimatter variant.",
        cost: x => 10 ** (x ** 1.156) * 2e6,
        effect: x => 1e4 * x,
        isUnlocked: () => TechBuildings.skill.amount > 3
    }
}