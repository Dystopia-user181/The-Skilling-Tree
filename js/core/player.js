export function getStartPlayer() {
    return {
        skillPoints: 0,
        bestSkillPoints: 0,
        progression: {
            noSkillIssue: false
        },
        skills: {
            skillBits: 0,
            pickapathBits: 0,
            rebuyables: SkillPointRebuyableState.initPlayer(SkillPointUpgrades)
        },
        maze: {
            graph: Graph.createNewGraph(6, true),
            currentSize: 6,
            nextSize: 6,
            currentNode: 0,
            skillPointDelay: 0,
            rerollCooldown: 0
        },
        breadth: {
            queue: [],
            seen: [],
            otherQueue: [],
            otherSeen: [],
            otherCurrentNode: 35
        },
        depth: {
            stack: [0],
            seen: [],
            dead: []
        },
        search: {
            cooldown: 0,
            mode: 0
        },
        records: {
            currentTime: 0,
            sizes: {
                30: Number.MAX_VALUE,
                50: Number.MAX_VALUE,
                64: Number.MAX_VALUE
            }
        },
        options: {
            lastOpenTab: 0,
            lastSaveTimer: Date.now()
        },
        version: 0
    }
}

window.player = {};