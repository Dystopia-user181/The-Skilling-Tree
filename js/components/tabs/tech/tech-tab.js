import "./tech-building-row.js";

Vue.component("tech-tab", {
    computed: {
        buildings: () => TechBuildings
    },
    methods: {
        addInflaton() {
            Currency.inflatons.add(1);
        },
        addElectron() {
            Currency.electrons.add(1);
        }
    },
    template: `
    <div>
        <br>
        <button @click="addElectron">
            Give electrons
        </button>
        <br>
        <button @click="addInflaton">
            Give inflatons
        </button>
        <br>
        <tech-building-row
            v-for="building in buildings"
            :key="building.id + '-tech-building-row'"
            :building="building"
        />
    </div>`
});