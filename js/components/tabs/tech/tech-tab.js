import "./tech-building-row.js";
import "./tickspeed-button.js";

Vue.component("tech-tab", {
    data() {
        return {
            tickspeedUnlocked: false,
            isGameEnd: false
        };
    },
    computed: {
        buildings: () => TechBuildings
    },
    methods: {
        update() {
            this.tickspeedUnlocked = player.tech.buildings.galaxy >= 1;
            this.isGameEnd = Currency.inflatons.gte(Number.MAX_VALUE) && Currency.electrons.gte(Number.MAX_VALUE);
        },
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
        <template v-if="!isGameEnd">
            <button @click="addElectron">
                Give electrons
            </button>
            <br>
            <button @click="addInflaton">
                Give inflatons
            </button>
            <br>
            <tickspeed-button v-if="tickspeedUnlocked" />
            <tech-building-row
                v-for="building in buildings"
                :key="building.id + '-tech-building-row'"
                :building="building"
            />
        </template>
        <template v-else>
            <a
                href="https://jacorb90.me/DistInc.github.io/main.html"
                target="_blank"
            >
                Go play better games
            </a>
            <br>
            <a
                href="https://ivark.github.io"
                target="_blank"
            >
                Literally any other game
            </a>
            <br>
            <a
                href="https://orteil.dashnet.org/cookieclicker/"
                target="_blank"
            >
                Would be better than this
            </a>
        </template>
    </div>`
});