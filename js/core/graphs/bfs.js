const BFS = {
    moveOne() {
        const bfs = player.breadth;
        if (bfs.queue.includes(Graph.endPoint)) {
            bfs.queue = [];
            bfs.seen.push(Graph.endPoint);
            Graph.goto(Graph.endPoint);
            return;
        }
        const node = Node(bfs.queue.shift() ?? 0);
        if (node.isSeen) return;
        player.maze.currentNode = node.id;
        bfs.seen.push(node.id);

        for (const neighbour of node.neighbours) {
            const node = Node(neighbour);
            if (!node.isSeen && !node.isInBFSQueue) {
                bfs.queue.push(neighbour);
            }
        }
        EventHub.dispatch(GAME_EVENTS.MAZE_MOVED);
    }
};