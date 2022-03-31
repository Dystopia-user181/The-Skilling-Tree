import "./general/effect-display.js";
import "./tabs/maze-tab.js";
import "./tabs/options-tab.js";
import "./tabs/skills/skills-tab.js";
import "./tabs/superskills-tab.js";
import "./tabs/tech/tech-tab.js";

Vue.component("game-ui", {
    data() {
        return {
            Tabs,
            activeTab: 0,
            spUnlock: false,
            techUnlock: false,
            sp: 0,
            inflatons: 0,
            electrons: 0,
            timeSinceLastSave: 0
        }
    },
    methods: {
        update() {
            this.activeTab = player.options.lastOpenTab;
            this.spUnlock = player.progression.noSkillIssue;
            if (this.spUnlock) this.sp = player.skillPoints;
            this.timeSinceLastSave = Date.now() - player.options.lastSaveTimer;
            this.techUnlock = PickapathUpgrades.techPair.canBeApplied;
            if (this.techUnlock) {
                this.inflatons = player.tech.inflatons;
                this.electrons = player.tech.electrons;
            }
        }
    },
    template: `
    <div>
        <h2>The Modding Graph</h2>
        <span>Time since last save: {{ formatTime(timeSinceLastSave) }}</span>
        <br>
        <button
            v-for="(tab, idx) in Tabs.filter(x => x.unlocked)"
            @click="tab.set()"
        >
            {{ tab.name }}
        </button>
        <br>
        <template v-if="spUnlock">
            <br>
            You have <span style="color: #08b">{{ format(sp, 3) }}</span> Skill Points.
        </template>
        <template v-if="techUnlock">
            <br>
            You have <span style="color: #f84">e{{ format(inflatons, 3) }}</span> Inflatons.
            <br>
            You have <span style="color: #a76">{{ format(electrons, 3) }}</span> Electrons.
        </template>
        <component :is="Tabs[activeTab].component" />
    </div>`
});