const Graph = {
    newGraph() {
        player.maze.currentNode = 0;
        player.maze.currentSize = player.maze.nextSize;
        player.maze.graph = this.createNewGraph();
        EventHub.dispatch(GAME_EVENTS.MAZE_MOVED);
        EventHub.dispatch(GAME_EVENTS.NEW_MAZE);
    },
    createNewGraph(n = player.maze.currentSize) {
        const n2 = n * n;
        const newGraph = Array.from(Array(n2), () => []);
        const connections = new Set();
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
                        if (Math.random() > 0.8 / odds) {
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
        player.maze.rerollCooldown = 10000;
        this.newGraph();
    },

    get minSize() {
        return 6;
    },
    get maxSize() {
        return 12;
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
        return player.maze.currentNode === player.maze.currentSize * player.maze.currentSize - 1;
    }
}