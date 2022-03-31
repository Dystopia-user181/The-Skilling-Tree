Vue.component("options-tab", {
    methods: {
        hardReset() {
            GameStorage.hardReset();
        }
    },
    template: `
    <div>
        <br>
        <button @click="hardReset">
            Hard Reset
        </button>
    </div>`
});