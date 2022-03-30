Components.add({
    name: "skill-point-upgrade",
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
        Cost: {{ upgrade.cost }} Skill Points
    </button>`
});

Components.add({
    name: "skill-point-rebuyable",
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
        :disabled="!canBeBought"
        @click="upgrade.purchase()"
    >
        <b>{{ upgrade.config.title }}</b>
        <br>
        <br>
        {{ upgrade.config.description }}
        <br>
        <effect-display :config="upgrade"/>
        <br><br>
        Cost: {{ cost }} Skill Points
    </button>`
});

Components.add({
    name: "skills-tab",
    computed: {
        upgrades: () => SkillPointUpgrades.singles,
        rebuyables: () => SkillPointUpgrades.rebuyables,
    },
    template: `
    <div style="width: 1000px;">
        <br>
        <b>Upgrades</b>
        <br>
        <br>
        <skill-point-upgrade
            v-for="upgrade in upgrades"
            :key="upgrade.id + '-sp-upgrade'"
            :upgrade="upgrade"
        />
        <br>
        <br>
        <skill-point-rebuyable
            v-for="upgrade in rebuyables"
            :key="upgrade.id + '-sp-rebuyable'"
            :upgrade="upgrade"
        />
    </div>`
})