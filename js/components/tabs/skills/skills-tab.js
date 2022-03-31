import "./skill-point-upgrade.js";
import "./skill-point-rebuyable.js";
import "./adjust-bfs-slider.js";

Vue.component("skills-tab", {
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
        <adjust-bfs-slider />
        <br>
        <skill-point-rebuyable
            v-for="upgrade in rebuyables"
            :key="upgrade.id + '-sp-rebuyable'"
            :upgrade="upgrade"
        />
    </div>`
});