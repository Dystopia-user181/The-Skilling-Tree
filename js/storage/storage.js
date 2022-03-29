const GameStorage = {
    save() {
        localStorage.setItem(this.saveKey, JSON.stringify(player));
    },
    load() {
        player = getStartPlayer();
        const load = localStorage.getItem(this.saveKey);
        if (load) {
            player = JSON.parse(load);
        }
    },
    hardReset() {
        if (confirm("Hard reset?")) {
            localStorage.removeItem(this.saveKey);
            location.reload();
        }
    },
    normalisePlayer(playerObj = player, defaultObj = getStartPlayer()) {
        for (const i in defaultObj) {
            const prop = defaultObj;
            if (playerObj[i] === undefined) {
                playerObj[i] = prop;
            } else if (typeof prop === "object") {
                this.normalisePlayer(playerObj[i], prop);
            }
        }
    },
    get saveKey() {
        return "BFS-DFS-ScarletDys-22fools"
    }
};