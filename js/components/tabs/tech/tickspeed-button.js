Vue.component("tickspeed-button", {
    data() {
        return {
            canBeBought: false,
            cost: 0
        }
    },
    computed: {
        upgrade: () => Tech.tickspeed
    },
    methods: {
        update() {
            this.cost = Tech.tickspeed.cost;
            this.canBeBought = Tech.tickspeed.canBeBought;
        }
    },
    template: `<button
        class="o-upgrade"
        :disabled="!canBeBought"
        @click="upgrade.purchase()"
    >
        <b>Tickspeed upgrade</b>
        <br>
        <effect-display :config="upgrade" />
        <br>
        Cost: e{{ format(cost) }} inflatons
    </button>`
});