const Components = {
    _list: [],
    add(x) {
        this._list.push(x);
    },
    load() {
        for (const comp of this._list) {
            Vue.component(comp.name, comp);
        }
        GameUI.ui = new Vue({
            el: "#app",
            template: `<game-ui />`
        });
        GameUI.initialised = true;
    }
}

Vue.mixin({
    created() {
        GameUI.addHandler(this);
        if (GameUI.initialised) this.update?.();
    },
    destroyed() {
        GameUI.removeHandler(this);
    }
})

const GameUI = {
    initialised: false,
    ui: null,
    addHandler(target) {
        this._handlers.push(target);
    },
    removeHandler(target) {
        this._handlers.filter(x => x !== target);
    },
    update() {
        for (const comp of this._handlers) {
            if (comp.update) comp.update();
        }
    },
    _handlers: []
}