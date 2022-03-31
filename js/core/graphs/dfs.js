export const DFS = {
    moveOne() {
        if (Graph.atEnd) return;
        const dfs = player.depth;
        if (!dfs.stack.length) {
            if (SkillPointUpgrades.autoReroll.canBeApplied) Graph.reroll();
            return;
        }
        let node = Node(dfs.stack[dfs.stack.length - 1] ?? player.maze.currentNode);
        Graph.goto(node.id);
        dfs.seen[node.id] = true;
        Graph.updateThisTile(node.id);
        if (Graph.atEnd) return;
        if (node.neighbours.every(x => Node(x).isSeen)) {
            dfs.dead[node.id] = true;
            Graph.updateThisTile(node.id);
            dfs.stack.pop();
            if (dfs.stack.length) {
                node = Node(dfs.stack[dfs.stack.length - 1]);
                Graph.goto(node.id);
                if (Graph.atEnd) return;
            }
        }

        if (node.neighbours.includes(Graph.endPoint)) {
            dfs.stack.push(Graph.endPoint);
            EventHub.dispatch(GAME_EVENTS.MAZE_MOVED);
            return;
        }
        for (const neighbour of node.neighbours) {
            const node = Node(neighbour);
            if (!node.isSeen) {
                dfs.stack.push(neighbour);
                break;
            }
        }
        EventHub.dispatch(GAME_EVENTS.MAZE_MOVED);
    }
};