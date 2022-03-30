let lastTick = Date.now();
export function gameLoop(diff = Date.now() - lastTick) {
    lastTick = Date.now();

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

    if (diff > 0) {
        if (SkillPointUpgrades.dfs.canBeApplied && player.search.mode !== SEARCH_MODES.MANUAL) {
            player.search.cooldown += diff;
            const cooldownTime = Searching.cooldown;
            if (player.search.cooldown >= cooldownTime) {
                const n = Math.floor(player.search.cooldown / cooldownTime);
                player.search.cooldown = player.search.cooldown % cooldownTime;
                for (let i = 0; i < n && !Graph.atEnd; i++) {
                    if (player.search.mode === SEARCH_MODES.BFS) {
                        BFS.moveOne();
                    } else {
                        DFS.moveOne();
                    }
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