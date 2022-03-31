Vue.component("skill-point-rebuyable", {
    props: {
        upgrade: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            canBeBought: false,
            isUnlocked: false,
            cost: 0
        }
    },
    methods: {
        update() {
            this.canBeBought = this.upgrade.canBeBought;
            this.isUnlocked = this.upgrade.isUnlocked;
            this.cost = this.upgrade.cost;
        }
    },
    template: `
    <button
        v-if="isUnlocked"
        class="o-upgrade"
        @click="upgrade.purchase()"
    >
        <b>{{ upgrade.config.title }}</b>
        <br>
        <br>
        {{ upgrade.config.description }}
        <br>
        <effect-display :config="upgrade"/>
        <br><br>
        Cost: {{ format(cost, 3) }} Skill Points
    </button>`
});