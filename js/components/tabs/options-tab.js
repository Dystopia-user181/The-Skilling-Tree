Vue.component("options-tab", {
    methods: {
        hardReset() {
            GameStorage.hardReset();
        },
        exportSave() {
            GameStorage.exportSave();
        },
        importSave(event) {
            const reader = new FileReader();
            reader.onload = function() {
                GameStorage.importSave(reader.result);
            };
            reader.readAsText(event.target.files[0]);
        }
    },
    template: `
    <div>
        <br>
        <button @click="hardReset">
            Hard Reset
        </button>
        <br>
        <button @click="exportSave">
            Export Save
        </button>
        <br>
        Import from file:
        <input
            type="file"
            accept=".txt"
            @change="importSave"
        >
    </div>`
});