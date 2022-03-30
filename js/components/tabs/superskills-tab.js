Components.add({
    name: "pickapath-upgrade",
    props: {
        pickapath: {
            type: Object,
            required: true
        },
        order: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            hasUpgrade: false
        }
    },
    computed: {
        upgrade() {
            return this.pickapath[this.order];
        }
    },
    methods: {
        update() {
            this.hasUpgrade = this.upgrade.canBeApplied
        }
    },
    template: `
    <button
        class="o-upgrade"
        :class="{
            'o-upgrade--bought': hasUpgrade
        }"
        @click="pickapath.choose(order)"
    >
        <b>{{ order ? "Wisely" : "One" }}</b>
        <br>
        <br>
        {{ upgrade.config.description }}
        <br>
        <effect-display :config="upgrade"/>
    </button>`
});

Components.add({
    name: "pickapath-pair",
    props: {
        pickapath: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            isUnlocked: false,
            unlockText: ""
        }
    },
    methods: {
        update() {
            this.isUnlocked = this.pickapath.isUnlocked;
            if (!this.isUnlocked) {
                this.unlockText = funcOrConst(this.pickapath.config.unlockText ?? "Give this an unlockText dumbass");
            }
        },
    },
    template: `
    <div style="margin: 10px; border: 3px dotted; padding: 10px;">
        <pickapath-upgrade
            v-if="isUnlocked"
            :pickapath="pickapath"
            :order="0"
        />
        <pickapath-upgrade
            v-if="isUnlocked"
            :pickapath="pickapath"
            :order="1"
        />
        <span v-else>
            {{ unlockText }}
        </span>
    </div>
    `
});

Components.add({
    name: "superskills-tab",
    data() {
        return {
            records: {}
        }
    },
    computed: {
        pickapaths: () => PickapathUpgrades
    },
    methods: {
        update() {
            this.records = {... player.records.sizes};
        }
    },
    template: `
    <div>
        <br>
        Records:<br>
        <span v-for="(time, size) in records">
            {{ size }}x{{ size }}: {{ (time / 1000).toFixed(3) }}s
            <br>
        </span>
        <br>
        <b>
            You can only choose wisely
            <br>
            Pick one
        </b>
        <br>
        <br>
        <pickapath-pair
            v-for="pickapath in pickapaths"
            :key="pickapath.id + '-ssp-pickapath'"
            :pickapath="pickapath"
        />
    </div>`
});