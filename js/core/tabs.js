class TabState {
    constructor(config) {
        this.config = config;
    }

    get name() {
        return this.config.name;
    }

    get id() {
        return this.config.id;
    }

    get component() {
        return this.config.component
    }

    get unlocked() {
        return this.config.unlocked?.() ?? true;
    }

    set() {
        player.options.lastOpenTab = this.id;
        GameUI.update();
    }
}

export const Tabs = [
{
    name: "Maze",
    id: 0,
    component: "maze-tab"
},
{
    name: "Options",
    id: 1,
    component: "options-tab"
},
{
    name: "Skills",
    id: 2,
    component: "skills-tab",
    unlocked: () => player.progression.noSkillIssue
}
].map(x => new TabState(x));