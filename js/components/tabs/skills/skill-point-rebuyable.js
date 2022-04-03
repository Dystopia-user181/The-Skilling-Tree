Vue.component("skill-point-upgrade", {
    props: {
        upgrade: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            canBeBought: false,
            isBought: false,
            isUnlocked: false
        }
    },
    methods: {
        update() {
            this.canBeBought = this.upgrade.canBeBought;
            this.isBought = this.upgrade.canBeApplied;
            this.isUnlocked = this.upgrade.isUnlocked;
        }
    },
    template: `
    <button
        v-if="isUnlocked"
        class="o-upgrade"
        :class="{
            'o-upgrade--bought': isBought
        }"
        :disabled="!canBeBought && !isBought"
        @click="upgrade.purchase()"
    >
        <b>{{ upgrade.config.title }}</b>
        <br>
        <br>
        {{ upgrade.config.description }}
        <br><br>
        Cost: {{ format(upgrade.cost, 3) }} Skill Points
    </button>`
});