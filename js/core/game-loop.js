let lastTick = Date.now();
export function gameLoop(diff = Date.now() - lastTick) {
    lastTick = Date.now();
    diff = Math.min(diff, 10000);

    if (player.maze.rerollCooldown > 0) {
        player.maze.rerollCooldown = Math.max(player.maze.rerollCooldown - diff, 0);
    }
    if (Graph.atEnd) {
        const delayBefore = player.maze.skillPointDelay;
        player.maze.skillPointDelay += Math.min(diff, 1000);
        const deltaDelay = player.maze.skillPointDelay - delayBefore;
        diff -= deltaDelay;
        if (player.maze.skillPointDelay >= 1000) {
            player.progression.noSkillIssue = true;
            Currency.skillPoints.add(SkillPoints.gain);
            Graph.newGraph();
            player.maze.skillPointDelay = 0;
        }
    }

    if (player.search.mode === SEARCH_MODES.MANUAL) {
        player.records.currentTime += diff;
    }
    while (diff > 0 && player.search.mode !== SEARCH_MODES.MANUAL && SkillPointUpgrades.dfs.canBeApplied) {
        player.search.cooldown += diff;
        diff = 0;
        const cooldownTime = Searching.cooldown;
        if (player.search.cooldown >= cooldownTime) {
            const n = Math.floor(player.search.cooldown / cooldownTime);
            let turns = 0;
            player.search.cooldown = player.search.cooldown % cooldownTime;
            for (let i = 0; i < n && !Graph.atEnd; i++) {
                player.records.currentTime += cooldownTime;
                if (player.search.mode === SEARCH_MODES.BFS) {
                    BFS.moveOne();
                } else {
                    DFS.moveOne();
                }
                turns++;
            }
            const refund = n - turns;
            if (refund > 0) {
                diff = player.search.cooldown + refund * cooldownTime;
                const delayBefore = player.maze.skillPointDelay;
                player.maze.skillPointDelay += Math.min(diff, 1000);
                const deltaDelay = player.maze.skillPointDelay - delayBefore;
                diff -= deltaDelay;
                if (player.maze.skillPointDelay >= 1000) {
                    Currency.skillPoints.add(SkillPoints.gain);
                    Graph.newGraph();
                    player.maze.skillPointDelay = 0;
                }
            }
        }
    }

    if (player.options.lastSaveTimer < lastTick - 10000) {
        GameStorage.save();
        player.options.lastSaveTimer = lastTick;
    }
    GameUI.update();
}