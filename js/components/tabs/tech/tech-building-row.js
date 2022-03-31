Vue.component("tech-building-row", {
    props: {
        building: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            isUnlocked: false,
            amt: 0,
            gainPerSecond: 0,
            cost: 0
        }
    },
    methods: {
        update() {
            this.isUnlocked = this.building.isUnlocked;
            this.amt = this.building.amount;
            this.gainPerSecond = this.building.effectValue;
            this.cost = this.building.cost;
        }
    },
    template: `
    <div
        v-if="isUnlocked"
        style="border-bottom: 2px solid; padding: 10px;"
        @click="building.purchase()"
    >
        <h2>{{ building.config.name }} ({{ amt }})</h2>
        {{ building.config.description }}
        <br>
        Currently: {{ format(gainPerSecond) }}/s
        <br>
        Cost: {{ format(cost) }} electrons
    </div>`
});