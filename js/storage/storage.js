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
        this.normalisePlayer();
    },
    hardReset() {
        if (confirm("Hard reset?")) {
            localStorage.removeItem(this.saveKey);
            location.reload();
        }
    },
    normalisePlayer(playerObj = player, defaultObj = getStartPlayer()) {
        for (const i in defaultObj) {
            const prop = defaultObj[i];
            if (playerObj[i] === undefined) {
                playerObj[i] = prop;
            } else if (prop.constructor === Object) {
                this.normalisePlayer(playerObj[i], prop);
            }
        }
    },
    get saveKey() {
        return "BFS-DFS-ScarletDys-22fools"
    }
};