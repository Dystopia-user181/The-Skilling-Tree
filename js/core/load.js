const Loader = {
    loadVue() {
        Components.load();
    },
    loadPlayer() {
        GameStorage.load();
    },
    loadAll() {
        this.loadPlayer();
        EventHub.logic.on(GAME_EVENTS.AFTER_PLAYER_LOAD, () => {
            this.loadVue();
            setInterval(() => gameLoop(), 33);
            EventHub.logic.offAll(this);
        }, this);
    }
}

window.onload = () => Loader.loadAll();