function getStartPlayer() {
    return {
        skillPoints: 0,
        progression: {
            noSkillIssue: false
        },
        skills: {
            skillBits: 0
        },
        maze: {
            graph: Graph.createNewGraph(6),
            currentSize: 6,
            nextSize: 6,
            currentNode: 0,
            skillPointDelay: 0
        },
        breadth: {
            queue: [],
            seen: []
        },
        depth: {
            stack: [],
            seen: [],
            dead: []
        },
        options: {
            lastOpenTab: 0,
            lastSaveTimer: Date.now()
        }
    }
}

let player;