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
        GameUI.update();
    }
};

Vue.mixin({
    created() {
        if (this.update) {
            this.on(GAME_EVENTS.UPDATE, () => this.update());
            if (GameUI.initialised) this.update();
        }

        const recomputed = Object.create(null);
        const watchers = this._computedWatchers;

        if (!watchers) return;

        for (const key in watchers) makeRecomputable(watchers[key], key, recomputed);

        this.$recompute = key => recomputed[key] = !recomputed[key];
        Vue.observable(recomputed);
    },
    destroyed() {
        EventHub.ui.offAll(this);
    },
    methods: {
        on(event, fn) {
            EventHub.ui.on(event, fn, this);
        }
    }
});

function makeRecomputable(watcher, key, recomputed) {
    const original = watcher.getter;
    recomputed[key] = true;

    watcher.getter = vm => (recomputed[key], original.call(vm, vm));
}

const GameUI = {
    initialised: false,
    ui: null,
    events: [],
    flushPromise: undefined,
    dispatch(event) {
        const index = this.events.indexOf(event);
        if (index !== -1) {
          this.events.splice(index, 1);
        }
        if (event !== GAME_EVENTS.UPDATE) {
          this.events.push(event);
        }
        if (this.flushPromise) return;
        this.flushPromise = Promise.resolve()
          .then(this.flushEvents.bind(this));
    },
    flushEvents() {
        this.flushPromise = undefined;
        for (const event of this.events) {
            EventHub.ui.dispatch(event);
        }
        EventHub.ui.dispatch(GAME_EVENTS.UPDATE);
        this.events = [];
    },
    update() {
        this.dispatch(GAME_EVENTS.UPDATE);
    }
};