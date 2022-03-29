Components.add({
    name: "maze-node",
    props: {
        id: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            isDisabled: false,
            spGain: 0,
            isEnd: false,
            isCurrent: false
        };
    },
    computed: {
        xy() {
            return Graph.decompose(this.id);
        },
        classObj() {
            return {
                'o-maze-node--disabled': this.isDisabled && !this.isCurrent,
                'o-maze-node--current': this.isCurrent,
                'o-maze-node--finish': this.isEnd
            };
        }
    },
    created() {
        this.on(GAME_EVENTS.MAZE_MOVED, () => this.onMazeMoved());
        this.onMazeMoved();
        this.on(GAME_EVENTS.NEW_MAZE, () => this.onNewMaze());
        this.onNewMaze();
    },
    methods: {
        update() {
            this.spGain = SkillPoints.gain;
        },
        onMazeMoved() {
            this.isDisabled = !player.maze.graph[player.maze.currentNode].includes(this.id);
            this.isCurrent = player.maze.currentNode === this.id;
            this.$recompute("xy");
        },
        onNewMaze() {
            this.isEnd = this.id === player.maze.currentSize * player.maze.currentSize - 1;
        },
        handleClick() {
            if (!this.isDisabled && !Graph.atEnd) {
                Graph.goto(this.id);
            }
        }
    },
    template: `
    <div
        class="o-maze-node"
        :class="classObj"
        :style="{
            left: xy[0]*45 + 25 + 'px',
            top: xy[1]*45 + 25 + 'px'
        }"
        @click="handleClick"
    >
        {{ isEnd ? spGain + "SP" : id }}
    </div>`
});

Components.add({
    name: "maze-edge",
    props: {
        connection: {
            type: String,
            required: true
        }
    },
    computed: {
        decomposed() {
            return this.connection.split(",").map(x => Number(x));
        },
        xy1() {
            return Graph.decompose(this.decomposed[0]);
        },
        xy2() {
            return Graph.decompose(this.decomposed[1]);
        },
        isDisabled() {
            return !this.decomposed.includes(player.maze.currentNode);
        }
    },
    created() {
        this.on(GAME_EVENTS.MAZE_MOVED, () => this.$recompute("isDisabled"));
        this.on(GAME_EVENTS.NEW_MAZE, () => (this.$recompute("xy1"), this.$recompute("xy2")));
    },
    template: `
    <line
        class="o-maze-connection"
        :class="{
            'o-maze-connection--disabled': isDisabled
        }"
        :x1="xy1[0]*45 + 25"
        :y1="xy1[1]*45 + 25"
        :x2="xy2[0]*45 + 25"
        :y2="xy2[1]*45 + 25"
    />`
});

Components.add({
    name: "maze-size-display",
    data() {
        return {
            isUnlocked: false,
            currentSize: 6,
            nextSize: 6,
            minSize: 6,
            maxSize: 6
        };
    },
    methods: {
        update() {
            this.isUnlocked = SkillPointUpgrades.increaseMazeSize.canBeApplied;
            this.currentSize = player.maze.currentSize;
            this.nextSize = player.maze.nextSize;
            this.minSize = Graph.minSize;
            this.maxSize = Graph.maxSize;
        },
        increment() {
            Graph.incrementSize();
            this.update();
        },
        decrement() {
            Graph.decrementSize();
            this.update();
        }
    },
    template: `
    <div v-if="isUnlocked">
        Next Size:
        <button
            class="o-slider-button"
            :disabled="nextSize <= minSize"
            @click="decrement"
        >
            -
        </button>
        <span style="display: inline-block; width: 70px; text-align: center;">
            {{ nextSize }}
        </span>
        <button
            class="o-slider-button"
            :disabled="nextSize >= maxSize"
            @click="increment"
        >
            +
        </button>
        <br>
        Current Size: {{ currentSize }}
        <br>
        <br>
    </div>`
});
Components.add({
    name: "maze-tab",
    data() {
        return {
            connections: new Set(),
            svgSize: 0,
            size: 0,
            rerollCooldown: 0,
            canReroll: false
        };
    },
    created() {
        this.on(GAME_EVENTS.NEW_MAZE, () => this.updateGraph());
        this.updateGraph();
    },
    methods: {
        update() {
            this.rerollCooldown = player.maze.rerollCooldown / 1000;
            this.canReroll = Graph.canReroll;
        },
        reroll() {
            Graph.reroll();
        },
        updateGraph() {
            const connections = new Set();
            const graph = player.maze.graph;
            for (const node in graph) {
                for (const otherNode of graph[node]) {
                    connections.add([node, otherNode].sort((a, b) => a - b).join(","));
                }
            }
            this.connections = connections;
            const size = player.maze.currentSize;
            this.size = size * size;
            this.svgSize = 45 * size
        }
    },
    template: `
    <div>
        <br>
        <maze-size-display />
        <button
            :disabled="!canReroll"
            @click="reroll"
        >
            Reroll Maze
            <span v-if="rerollCooldown">
                (Next in {{ rerollCooldown.toFixed(2) }}s)
            </span>
        </button>
        <div class="l-maze">
            <maze-node
                v-for="id in size"
                :key="id + '-maze-node'"
                :id="id - 1"
            />
            <svg :style="{
                width: svgSize,
                height: svgSize
            }">
                <maze-edge
                    v-for="connection in connections"
                    :key="connection + '-maze-connection'"
                    :connection="connection"
                />
            </svg>
        </div>
    </div>`
});