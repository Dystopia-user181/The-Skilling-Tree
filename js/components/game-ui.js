Components.add({
    name: "game-ui",
    data() {
        return {
            Tabs,
            activeTab: 0,
            spUnlock: false,
            sp: 0
        }
    },
    methods: {
        update() {
            this.activeTab = player.options.lastOpenTab;
            this.spUnlock = player.progression.noSkillIssue;
            if (this.spUnlock) this.sp = player.skillPoints;
        }
    },
    template: `
    <div>
        <h2>The Modding Graph</h2>
        <button
            v-for="(tab, idx) in Tabs.filter(x => x.unlocked)"
            @click="tab.set()"
        >
            {{ tab.name }}
        </button>
        <br>
        <template v-if="spUnlock">
            <br>
            You have <span style="color: #08b">{{ sp }}</span> Skill Points.
        </template>
        <component :is="Tabs[activeTab].component" />
    </div>`
})