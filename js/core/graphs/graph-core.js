export const Graph = {
    newGraph() {
        player.maze.currentSize = player.maze.nextSize;
        player.maze.graph = this.createNewGraph();
        this.resetProgress();
        EventHub.dispatch(GAME_EVENTS.NEW_MAZE);
    },
    resetProgress() {
        player.maze.currentNode = 0;
        player.breadth.queue = [];
        player.breadth.seen = [];
        player.breadth.otherQueue = [];
        player.breadth.otherSeen = [];
        player.breadth.otherCurrentNode = this.endPoint;
        player.depth.stack = [0];
        player.depth.seen = [];
        player.depth.dead = [];
        player.search.cooldown = 0;
        if (player.search.mode === SEARCH_MODES.BFS) {
            BFS.moveOne();
        } else {
            DFS.moveOne();
        }
        EventHub.dispatch(GAME_EVENTS.MAZE_MOVED);
        EventHub.dispatch(GAME_EVENTS.MAZE_RESET_PROGRESS);
    },
    createNewGraph(n = player.maze.currentSize, useDefault = false) {
        const n2 = n * n;
        const newGraph = Array.from(Array(n2), () => []);
        const connections = new Set();
        const chance = useDefault ? 0.8 : 0.8 * SkillPointUpgrades.moreConnections.effectOrDefault();
        for (let i = 0; i < n2; i++) {
            const decomposed = this.decompose(i, n);
            const xMin = Math.max(decomposed[0] - 3, 0);
            const xMax = Math.min(decomposed[0] + 3, n - 1);
            const yMin = Math.max(decomposed[1] - 3, 0);
            const yMax = Math.min(decomposed[1] + 3, n - 1);
            const odds = (xMax - xMin) * (yMax - yMin) - 1;
            for (let x = xMin; x <= xMax; x++) {
                for (let y = yMin; y <= yMax; y++) {
                    if (x !== decomposed[0] || y !== decomposed[0]) {
                        if (Math.random() > chance / odds) {
                            continue;
                        }
                        const postProc = [i, this.compose([x, y], n)].sort((a, b) => a - b).join(",");
                        connections.add(postProc);
                    }
                }
            }
        }
        for (const connection of connections) {
            const decomposed = connection.split(",").map(x => Number(x));
            newGraph[decomposed[0]].push(decomposed[1]);
            newGraph[decomposed[1]].push(decomposed[0]);
        }
        return newGraph;
    },
    decompose(number, size = player.maze.currentSize) {
        return [number % size, Math.floor(number / size)];
    },
    compose(obj, size = player.maze.currentSize) {
        return obj[0] + obj[1]*size;
    },

    goto(x) {
        player.maze.currentNode = x;
        EventHub.dispatch(GAME_EVENTS.MAZE_MOVED, x);
    },

    get canReroll() {
        return !player.maze.rerollCooldown && !player.maze.skillPointDelay;
    },
    reroll() {
        if (!this.canReroll) return;
        player.maze.rerollCooldown = SkillPointUpgrades.autoReroll.effectOrDefault()*1000;
        this.newGraph();
    },

    get minSize() {
        return 6;
    },
    get maxSize() {
        return 12 + SkillPointUpgrades.increaseMaxMapSize.effectValue;
    },
    incrementSize() {
        player.maze.nextSize += 2;
        player.maze.nextSize = Math.min(player.maze.nextSize, this.maxSize);
    },
    decrementSize() {
        player.maze.nextSize -= 2;
        player.maze.nextSize = Math.max(player.maze.nextSize, this.minSize);
    },

    get atEnd() {
        return player.maze.currentNode === this.endPoint;
    },
    get endPoint() {
        return player.maze.currentSize * player.maze.currentSize - 1;
    }
}

class NodeState {
    constructor(x) {
        this.id = x;
    }

    get neighbours() {
        return player.maze.graph[this.id];
    }

    isNeighbourOf(x) {
        return this.neighbours.includes(x);
    }

    get isSeen() {
        if (player.search.mode === SEARCH_MODES.MANUAL) return false;
        return (player.search.mode === SEARCH_MODES.BFS ? player.breadth.seen : player.depth.seen).includes(this.id);
    }

    get isDead() {
        if (player.search.mode !== SEARCH_MODES.DFS) return false;
        return player.depth.dead.includes(this.id);
    }

    get isCurrent() {
        return player.maze.currentNode === this.id;
    }

    get isEnd() {
        return this.id === Graph.endPoint;
    }

    get shouldntExist() {
        return this.id > Graph.endPoint;
    }

    get isInBFSQueue() {
        if (player.search.mode !== SEARCH_MODES.BFS) return false;
        return player.breadth.queue.includes(this.id);
    }

    get isSeenBySecondBFS() {
        if (!SkillPointUpgrades.doubleBFS.canBeApplied || player.search.mode !== SEARCH_MODES.BFS) return false;
        return player.breadth.otherSeen.includes(this.id);
    }

    get isInSecondBFSQueue() {
        if (!SkillPointUpgrades.doubleBFS.canBeApplied || player.search.mode !== SEARCH_MODES.BFS) return false;
        return player.breadth.otherQueue.includes(this.id);
    }

    get isCurrentInSecondBFS() {
        if (!SkillPointUpgrades.doubleBFS.canBeApplied || player.search.mode !== SEARCH_MODES.BFS) return false;
        return player.breadth.otherCurrentNode === this.id;
    }

    static get(x) {
        const storedValue = NodeStates.get(x);
        if (storedValue) return storedValue
        else {
            NodeStates.set(x, new NodeState(x));
            return NodeStates.get(x);
        }
    }
}

export const NodeStates = new Map();

export function Node(x) {
    return NodeState.get(x);
}