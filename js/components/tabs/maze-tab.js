Vue.component("maze-node", {
    props: {
        id: {
            type: Number,
            required: true
        },
        isAuto: {
            type: Boolean,
            required: false,
            default: false
        }
    },
    data() {
        return {
            isDisabled: false,
            spGain: 0,
            isEnd: false,
            isCurrent: false,
            isSeen: false,
            isInBFSQueue: false,
            isDead: false
        };
    },
    computed: {
        node() {
            return Node(this.id);
        },
        xy() {
            return Graph.decompose(this.id);
        },
        classObj() {
            return {
                'o-maze-node--disabled': (this.isDisabled && !this.isCurrent) || this.isAuto,
                'o-maze-node--seen': this.isSeen,
                'o-maze-node--current': this.isCurrent,
                'o-maze-node--queued': this.isInBFSQueue,
                'o-maze-node--dead': this.isDead,
                'o-maze-node--finish': this.isEnd
            };
        }
    },
    created() {
        this.on(GAME_EVENTS.MAZE_MOVED, () => this.onMazeMoved());
        this.onMazeMoved();
        this.on(GAME_EVENTS.MAZE_RESET_PROGRESS, () => this.onNewMaze());
        this.onNewMaze();
    },
    methods: {
        update() {
            this.spGain = SkillPoints.gain;
        },
        onMazeMoved() {
            if (this.node.shouldntExist) return;
            this.isDisabled = !this.node.isNeighbourOf(player.maze.currentNode);
            this.isCurrent = this.node.isCurrent || this.node.isCurrentInSecondBFS;
            this.isSeen = (this.node.isSeen || this.node.isSeenBySecondBFS) && !this.node.isDead;
            this.isDead = this.node.isDead;
            this.isInBFSQueue = this.node.isInBFSQueue || this.node.isInSecondBFSQueue;
            this.$recompute("xy");
        },
        onNewMaze() {
            if (this.node.shouldntExist) return;
            this.isEnd = this.node.isEnd;
        },
        handleClick() {
            if (!this.isDisabled && !Graph.atEnd && !this.isAuto) {
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
        {{ isEnd ? (spGain < 1e4 ? format(spGain, 3) : "") + "SP" : id }}
        <div
            v-if="isEnd && spGain >= 1e4"
            class="o-maze-node__tooltip"
        >
            {{ format(spGain, 3) }}SP
        </div>
    </div>`
});

Vue.component("maze-edge", {
    props: {
        connection: {
            type: String,
            required: true
        },
        isAuto: {
            type: Boolean,
            required: false,
            default: false
        }
    },
    data() {
        return {
            hasQueue: false,
            atEnd: false
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
            if (this.isAuto) {
                return !this.decomposed.every(x => Node(x).isSeen || Node(x).isSeenBySecondBFS);
            }
            return this.atEnd || !this.decomposed.includes(player.maze.currentNode);
        },
        classObj() {
            return {
                'o-maze-connection--disabled': this.isDisabled,
                'o-maze-connection--queued': this.hasQueue
            };
        }
    },
    created() {
        this.on(GAME_EVENTS.MAZE_MOVED, () => this.onMazeMoved());
        this.onMazeMoved();
        this.on(GAME_EVENTS.NEW_MAZE, () => this.onNewMaze());
    },
    methods: {
        onMazeMoved() {
            if (this.decomposed.some(x => Node(x).shouldntExist)) return;
            this.atEnd = Graph.atEnd;
            this.$recompute("isDisabled")
            this.hasQueue = this.decomposed.some(x => Node(x).isCurrent || Node(x).isCurrentInSecondBFS)
                && this.decomposed.some(x => Node(x).isInBFSQueue || Node(x).isInSecondBFSQueue);
        },
        onNewMaze() {
            if (this.decomposed.some(x => Node(x).shouldntExist)) return;
            this.$recompute("xy1");
            this.$recompute("xy2");
        }
    },
    template: `
    <line
        class="o-maze-connection"
        :class="classObj"
        :x1="xy1[0]*45 + 25"
        :y1="xy1[1]*45 + 25"
        :x2="xy2[0]*45 + 25"
        :y2="xy2[1]*45 + 25"
    />`
});

Vue.component("maze-size-display", {
    data() {
        return {
            isUnlocked: false,
            currentSize: 6,
            nextSize: 6,
            minSize: 6,
            maxSize: 6,
            currentTime: 0
        };
    },
    methods: {
        update() {
            this.isUnlocked = SkillPointUpgrades.increaseMazeSize.canBeApplied;
            this.currentSize = player.maze.currentSize;
            this.nextSize = player.maze.nextSize;
            this.minSize = Graph.minSize;
            this.maxSize = Graph.maxSize;
            this.currentTime = player.records.currentTime;
        },
        increment(x = 2) {
            Graph.incrementSize(x);
            this.update();
        },
        decrement(x = 2) {
            Graph.decrementSize(x);
            this.update();
        }
    },
    template: `
    <div v-if="isUnlocked">
        Next Size:
        <button
            v-if="maxSize >= 100"
            class="o-slider-button"
            :disabled="nextSize <= minSize"
            @click="decrement(20)"
        >
            - -
        </button>
        <button
            class="o-slider-button"
            :disabled="nextSize <= minSize"
            @click="decrement(2)"
        >
            -
        </button>
        <span style="display: inline-block; width: 70px; text-align: center;">
            {{ nextSize }}
        </span>
        <button
            class="o-slider-button"
            :disabled="nextSize >= maxSize"
            @click="increment(2)"
        >
            +
        </button>
        <button
            v-if="maxSize >= 100"
            class="o-slider-button"
            :disabled="nextSize >= maxSize"
            @click="increment(20)"
        >
            ++
        </button>
        <br>
        Current Size: {{ currentSize }} &nbsp;
        &nbsp; Current Time: {{ formatTime(currentTime) }}
        <br>
        <br>
    </div>`
});

Vue.component("maze-search-mode-display", {
    data() {
        return {
            isDFSUnlocked: false,
            isBFSUnlocked: false,
            isManual: true,
            searchCooldown: 2000,
            currentSearchTime: 0,
            mode: 0,
            SEARCH_MODES
        };
    },
    methods: {
        update() {
            this.mode = player.search.mode;
            this.isDFSUnlocked = SkillPointUpgrades.dfs.canBeApplied;
            this.isBFSUnlocked = SkillPointUpgrades.bfs.canBeApplied;
            this.isManual = player.search.mode === SEARCH_MODES.MANUAL;
            this.searchCooldown = Searching.cooldown;
            this.currentSearchTime = player.search.cooldown;
        },
        setMode(x) {
            if (confirm(`Switching will reset your maze progress!
Are you sure you want to do this?`)) Searching.setMode(x);
        }
    },
    template: `
    <div v-if="isDFSUnlocked">
        <br>
        <button
            :disabled="mode === SEARCH_MODES.MANUAL"
            @click="setMode(SEARCH_MODES.MANUAL)"
        >
            Set Mode to MANUAL
        </button>
        <button 
            :disabled="mode === SEARCH_MODES.DFS"
            @click="setMode(SEARCH_MODES.DFS)"
        >
            Set Mode to DEPTH FIRST SEARCH
        </button>
        <button
            v-if="isBFSUnlocked"
            :disabled="mode === SEARCH_MODES.BFS"
            @click="setMode(SEARCH_MODES.BFS)"
        >
            Set Mode to BREADTH FIRST SEARCH
        </button>
        <br>
        <template v-if="!isManual">
            <span v-if="searchCooldown <= 100">
                {{ format(1000 / searchCooldown, 2, 1) }} searches/s
            </span>
            <span v-else>
                {{ formatTime(searchCooldown - currentSearchTime) }} until next search
            </span>
        </template>
        <br>
        <br>
    </div>`
});

Vue.component("maze-tab", {
    data() {
        return {
            connections: new Set(),
            svgSize: 0,
            size: 0,
            length: 0,
            rerollCooldown: 0,
            canReroll: false,
            isAuto: false,
            shouldShowLargeMazeRepresentation: false,
            spGain: 0,
            ctx: null
        };
    },
    created() {
        this.on(GAME_EVENTS.MAZE_MOVED, () => this.onMazeMove());
        this.on(GAME_EVENTS.MAZE_RESET_PROGRESS, () => this.updateAutomation());
        this.updateAutomation();
        this.on(GAME_EVENTS.NEW_MAZE, () => this.updateGraph());
        this.updateGraph();
    },
    mounted() {
        this.ctx = this.$refs.canvas?.getContext("2d");
        if (this.ctx) {
            this.initCanvasGraph();
        }
    },
    methods: {
        update() {
            this.rerollCooldown = player.maze.rerollCooldown / 1000;
            this.canReroll = Graph.canReroll;
            this.spGain = SkillPoints.gain;
        },
        onMazeMove() {
            if (this.ctx) {
                this.drawAdditionalStuff();
            }
        },
        reroll() {
            Graph.reroll();
        },
        updateAutomation() {
            this.isAuto = player.search.mode !== SEARCH_MODES.MANUAL;
            if (this.ctx) {
                this.initCanvasGraph();
            }
        },
        updateGraph() {
            const size = player.maze.currentSize;
            this.length = size;
            this.shouldShowLargeMazeRepresentation = size <= 32;
            if (!this.shouldShowLargeMazeRepresentation) {
                this.$nextTick(
                    () => {
                        this.ctx = this.$refs.canvas.getContext("2d");
                        if (this.ctx) {
                            this.initCanvasGraph();
                        }
                    }
                );
                return;
            }
            const connections = new Set();
            const graph = player.maze.graph;
            for (const node in graph) {
                for (const otherNode of graph[node]) {
                    connections.add(diSequenceAscending(node, otherNode));
                }
            }
            this.connections = connections;
            this.size = size * size;
            this.svgSize = 45 * size;
        },
        initCanvasGraph() {
            if (!this.ctx) return;
            const l = this.length;
            this.ctx.fillStyle = "#999";
            this.ctx.fillRect(0, 0, l * 2, l * 2);
            for (let i = 0; i < l; i++) {
                for (let j = 0; j < l; j++) {
                    const nodeColour = this.nodeColour(i * l + j);
                    if (!nodeColour) continue;
                    this.ctx.fillStyle = nodeColour;
                    this.ctx.fillRect(j * 2, i * 2, 2, 2);
                }
            }
        },
        drawAdditionalStuff() {
            const l = this.length;
            for (const t of Graph.updateTheseTiles) {
                const [i, j] = Graph.decompose(t);
                this.ctx.fillStyle = this.nodeColour(t) || "#999";
                this.ctx.fillRect(i * 2, j * 2, 2, 2);
            }
            Graph.updateTheseTiles.clear();
        },
        nodeColour(id) {
            const node = Node(id);
            if (node.isCurrent || node.isCurrentInSecondBFS) return "#000";
            if (node.isEnd) return "#0f0";
            if (node.isDead) return "#f00";
            if (node.isSeen || node.isSeenBySecondBFS) return "#f90";
            if (node.isInBFSQueue || node.isInSecondBFSQueue) return "#089";
            return false;
        }
    },
    template: `
    <div>
        <br>
        <maze-size-display />
        <maze-search-mode-display />
        <button
            :disabled="!canReroll"
            @click="reroll"
        >
            Reroll Maze
            <span v-if="rerollCooldown">
                (Next in {{ rerollCooldown.toFixed(2) }}s)
            </span>
        </button>
        <div
            v-if="shouldShowLargeMazeRepresentation"
            class="l-maze"
            :class="{
                'l-maze--auto': isAuto
            }"
        >
            <maze-node
                v-for="id in size"
                :key="id + '-maze-node'"
                :id="id - 1"
                :isAuto="isAuto"
            />
            <svg :style="{
                width: svgSize,
                height: svgSize
            }">
                <maze-edge
                    v-for="connection in connections"
                    :key="connection + '-maze-connection'"
                    :connection="connection"
                    :isAuto="isAuto"
                />
            </svg>
        </div>
        <div v-else>
            Skill Points Gain: {{ format(spGain, 3) }}
            <br><br>
            The maze is too big to be represented using nodes
            <br>
            When I say "too big" I don't mean "oh it lags a little", I mean "Vue refuses to render anything".
            <br><br>
            <canvas
                ref="canvas"
                :width="length * 2"
                :height="length * 2"
            />
        </div>
    </div>`
});