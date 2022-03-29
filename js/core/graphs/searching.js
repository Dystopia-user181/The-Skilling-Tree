export { BFS } from "./bfs.js";

export const SEARCH_MODES = {
    MANUAL: 0,
    BFS: 1,
    DFS: 2
}

export const Searching = {
    setMode(x) {
        player.search.mode = x;
        Graph.resetProgress();
    },

    get cooldown() {
        let cooldown = 1500;
        cooldown /= SkillPointUpgrades.decreaseSearchSpeed.effectValue;
        cooldown /= SkillPointUpgrades.moreConnections.effectOrDefault();
        if (SkillPointUpgrades.doubleBFS.canBeApplied && player.search.mode === SEARCH_MODES.BFS) {
            cooldown *= 2;
        }
        return cooldown;
    }
}