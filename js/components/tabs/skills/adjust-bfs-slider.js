Vue.component("adjust-bfs-slider", {
    data() {
        return {
            bulkCap: 0,
            bulk: 0,
            slowdown: 1,
            increase: 1,
            unlocked: false
        }
    },
    methods: {
        update() {
            this.unlocked = SkillPointUpgrades.bfsBulk.amount >= 1;
            this.bulkCap = BFS.maxBulkLevels;
            this.bulk = player.breadth.bulkLevels;
            this.increase = BFS.bulkIncrease;
            this.slowdown = BFS.bulkSlowdown;
        },
        increment() {
            BFS.incrementBulk();
        },
        decrement() {
            BFS.decrementBulk();
        }
    },
    template: `
    <div v-if="unlocked">
        BFS bulk:
        <button
            class="o-slider-button"
            @click="decrement"
        >
            -
        </button>
        <span style="display: inline-block; width: 70px; text-align: center;">
            {{ bulk }}
        </span>
        <button
            class="o-slider-button"
            @click="increment"
        >
            +
        </button>
        <br>
        x{{ format(increase) }} BFS bulk<br>
        /{{ format(slowdown) }} BFS speed
    </div>`
});