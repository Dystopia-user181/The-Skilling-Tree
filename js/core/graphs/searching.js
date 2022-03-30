export { BFS } from "./bfs.js";
export { DFS } from "./dfs.js";

export const SEARCH_MODES = {
    MANUAL: 0,
    DFS: 1,
    BFS: 2
}

export const Searching = {
    setMode(x) {
        player.search.mode = x;
        Graph.resetProgress();
    },

    get cooldown() {
        let cooldown = 1000;
        cooldown /= SkillPointUpgrades.decreaseSearchSpeed.effectValue;
        cooldown /= SkillPointUpgrades.moreConnections.effectOrDefault();
        if (SkillPointUpgrades.doubleBFS.canBeApplied && player.search.mode === SEARCH_MODES.BFS) {
            cooldown *= 2;
        }
        cooldown /= PickapathUpgrades.connectionsPair.oneConnection.effectOrDefault();
        cooldown /= PickapathUpgrades.connectionsPair.twoConnections.effectOrDefault();
        if (player.search.mode === SEARCH_MODES.DFS) cooldown /= PickapathUpgrades.searchImprovePair.dfs.effectOrDefault();
        return cooldown;
    }
}