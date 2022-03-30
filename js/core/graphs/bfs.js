export const BFS = {
    moveOne() {
        if (Graph.atEnd) return;
        const bfs = player.breadth;
        const hasSecond = SkillPointUpgrades.doubleBFS.canBeApplied;
        if (bfs.queue.includes(Graph.endPoint)) {
            bfs.queue = [];
            bfs.otherQueue = [];
            bfs.seen[Graph.endPoint] = true;
            Graph.goto(Graph.endPoint);
            return;
        }
        if (hasSecond) {
            const found = bfs.queue.find(x => Node(x).isSeenBySecondBFS);
            if (found !== undefined) {
                bfs.queue = [];
                bfs.otherQueue = [];
                bfs.seen[found] = true;
                Graph.goto(Graph.endPoint);
                bfs.otherCurrentNode = Graph.endPoint;
                return;
            }
        }
        const bulk = PickapathUpgrades.searchImprovePair.bfs.canBeApplied;
        const maxBulk = bulk ? Math.max(Math.min(bfs.queue.length, 8), 1) : 1;
        const maxBulkOther = bulk ? Math.max(Math.min(bfs.otherQueue.length, 8), 1) : 1;
        for (let i = 0; i < maxBulk; i++) {
            const node = Node(bfs.queue.shift() ?? player.maze.currentNode);
            if (node.isSeen) {
                if (SkillPointUpgrades.autoReroll.canBeApplied) Graph.reroll();
                return;
            }
            Graph.goto(node.id);
            bfs.seen[node.id] = true;

            for (const neighbour of node.neighbours) {
                const node = Node(neighbour);
                if (!node.isSeen && !node.isInBFSQueue) {
                    bfs.queue.push(neighbour);
                }
            }
        }
        if (hasSecond) {
            const found = bfs.otherQueue.find(x => Node(x).isSeen);
            if (found !== undefined) {
                bfs.queue = [];
                bfs.otherQueue = [];
                bfs.otherSeen[found] = true;
                Graph.goto(Graph.endPoint);
                bfs.otherCurrentNode = Graph.endPoint;
                return;
            }
            for (let i = 0; i < maxBulkOther; i++) {
                const otherNode = Node(bfs.otherQueue.shift() ?? bfs.otherCurrentNode);
                if (otherNode.isSeenBySecondBFS) {
                    if (SkillPointUpgrades.autoReroll.canBeApplied) Graph.reroll();
                    return;
                }
                bfs.otherCurrentNode = otherNode.id;
                bfs.otherSeen[otherNode.id] = true;

                for (const neighbour of otherNode.neighbours) {
                    const node = Node(neighbour);
                    if (!node.isSeenBySecondBFS && !node.isInSecondBFSQueue) {
                        bfs.otherQueue.push(neighbour);
                    }
                }
            }
        }
        EventHub.dispatch(GAME_EVENTS.MAZE_MOVED);
    }
};