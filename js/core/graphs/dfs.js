export const DFS = {
    moveOne() {
        if (Graph.atEnd) return;
        const dfs = player.depth;
        if (!dfs.stack.length) {
            if (SkillPointUpgrades.autoReroll.canBeApplied) Graph.autoReroll();
            return;
        }
        const node = Node(dfs.stack[dfs.stack.length - 1] ?? player.maze.currentNode);
        Graph.goto(node.id);
        if (Graph.atEnd) return;
        dfs.seen.push(node.id);

        let foundNeighbour = false;
        for (const neighbour of node.neighbours) {
            const node = Node(neighbour);
            if (!node.isSeen) {
                dfs.stack.push(neighbour);
                foundNeighbour = true;
                break;
            }
        }
        if (!foundNeighbour) {
            let node = Node(dfs.stack[dfs.stack.length - 1]);
            while (dfs.stack.length && node.neighbours.every(x => Node(x).isSeen)) {
                dfs.dead.push(node.id);
                dfs.stack.pop();
                if (dfs.stack.length) {
                    node = Node(dfs.stack[dfs.stack.length - 1]);
                    Graph.goto(node.id);
                    if (Graph.atEnd) return;
                }
            }
        }
        EventHub.dispatch(GAME_EVENTS.MAZE_MOVED);
    }
};