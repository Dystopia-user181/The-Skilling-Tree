export const BFS = {
    moveOne() {
        if (Graph.atEnd) return;
        const bfs = player.breadth;
        const hasSecond = SkillPointUpgrades.doubleBFS.canBeApplied;
        if (bfs.queue.includes(Graph.endPoint)) {
            bfs.queue = [];
            bfs.otherQueue = [];
            bfs.seen.push(Graph.endPoint);
            Graph.goto(Graph.endPoint);
            return;
        }
        if (hasSecond) {
            const found = bfs.queue.find(x => Node(x).isSeenBySecondBFS);
            if (found !== undefined) {
                bfs.queue = [];
                bfs.otherQueue = [];
                bfs.seen.push(found);
                Graph.goto(Graph.endPoint);
                bfs.otherCurrentNode = Graph.endPoint;
                return;
            }
        }
        const node = Node(bfs.queue.shift() ?? player.maze.currentNode);
        if (node.isSeen) {
            if (SkillPointUpgrades.autoReroll.canBeApplied) Graph.reroll();
            return;
        }
        Graph.goto(node.id);
        bfs.seen.push(node.id);

        for (const neighbour of node.neighbours) {
            const node = Node(neighbour);
            if (!node.isSeen && !node.isInBFSQueue) {
                bfs.queue.push(neighbour);
            }
        }
        if (hasSecond) {
            const otherNode = Node(bfs.otherQueue.shift() ?? bfs.otherCurrentNode);
            if (otherNode.isSeenBySecondBFS) {
                if (SkillPointUpgrades.autoReroll.canBeApplied) Graph.reroll();
                return;
            }
            const found = bfs.otherQueue.find(x => Node(x).isSeen);
            if (found !== undefined) {
                bfs.queue = [];
                bfs.otherQueue = [];
                bfs.otherSeen.push(found);
                Graph.goto(Graph.endPoint);
                bfs.otherCurrentNode = Graph.endPoint;
                return;
            }
            bfs.otherCurrentNode = otherNode.id;
            bfs.otherSeen.push(otherNode.id);

            for (const neighbour of otherNode.neighbours) {
                const node = Node(neighbour);
                if (!node.isSeenBySecondBFS && !node.isInSecondBFSQueue) {
                    bfs.otherQueue.push(neighbour);
                }
            }
        }
        EventHub.dispatch(GAME_EVENTS.MAZE_MOVED);
    }
};