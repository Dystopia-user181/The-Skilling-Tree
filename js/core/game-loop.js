let lastTick = Date.now();
function gameLoop(diff = Date.now() - lastTick) {
    if (Graphs.atEnd) {
        player.maze.skillPointDelay += diff;
        if (player.maze.skillPointDelay >= 1000) {
            player.progression.noSkillIssue = true;
            Currency.skillPoints.add(SkillPoints.gain);
            Graphs.newGraph();
            player.maze.skillPointDelay = 0;
        }
    }
    lastTick = Date.now();
    if (player.options.lastSaveTimer < lastTick - 10000) {
        GameStorage.save();
        player.options.lastSaveTimer = lastTick;
    }
    GameUI.update();
}