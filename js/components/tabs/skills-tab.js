Components.add({
    name: "skill-point-upgrade",
    props: {
        upgrade: {
            type: SkillPointUpgradeState,
            required: true
        }
    },
    data() {
        return {
            canBeBought: false,
            isBought: false
        }
    },
    methods: {
        update() {
            this.canBeBought = this.upgrade.canBeBought;
            this.isBought = this.upgrade.canBeApplied;
        }
    },
    template: `
    <button
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
        Cost: {{ upgrade.cost }} Skill Points
    </button>`
});

Components.add({
    name: "skills-tab",
    computed: {
        upgrades: () => SkillPointUpgrades
    },
    template: `
    <div>
        <br>
        <b>Upgrades</b>
        <br>
        <br>
        <skill-point-upgrade
            v-for="upgrade in upgrades"
            :key="upgrade.id + '-sp-upgrade'"
            :upgrade="upgrade"
        />
    </div>`
})