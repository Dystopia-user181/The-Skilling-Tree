const Loader = {
    loadVue() {
        Components.load();
    },
    loadPlayer() {
        GameStorage.load();
    },
    loadAll() {
        this.loadPlayer();
        this.loadVue();
        setInterval(() => gameLoop(), 33);
    }
}

window.onload = () => Loader.loadAll();