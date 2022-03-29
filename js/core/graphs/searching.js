export { BFS } from "./bfs.js";

export const SEARCH_MODES = {
    MANUAL: 0,
    BFS: 1,
    DFS: 1
}

export const Searching = {
    setMode(x) {
        player.search.mode = x;
        Graph.resetProgress();
    },

    get cooldown() {
        return 1500;
    }
}