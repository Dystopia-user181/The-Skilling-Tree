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
            maze: player.maze,
            spGain: 0
        };
    },
    computed: {
        xy() {
            return Graphs.decompose(this.id);
        },
        isDisabled() {
            return !this.maze.graph[this.maze.currentNode].includes(this.id);
        },
        isEnd() {
            return this.id === this.maze.currentSize * this.maze.currentSize - 1;
        },
        classObj() {
            return {
                'o-maze-node--disabled': this.isDisabled && this.maze.currentNode !== this.id,
                'o-maze-node--current': this.maze.currentNode === this.id,
                'o-maze-node--finish': this.isEnd
            };
        }
    },
    methods: {
        update() {
            this.spGain = SkillPoints.gain;
        },
        handleClick() {
            if (!this.isDisabled && !Graphs.atEnd) {
                this.maze.currentNode = this.id;
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
            return Graphs.decompose(this.decomposed[0]);
        },
        xy2() {
            return Graphs.decompose(this.decomposed[1]);
        },
        isDisabled() {
            return !this.decomposed.includes(player.maze.currentNode);
        }
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
    name: "maze-tab",
    data() {
        return {
            maze: player.maze
        };
    },
    computed: {
        connections() {
            const connections = new Set();
            for (const node in this.maze.graph) {
                for (const otherNode of this.maze.graph[node]) {
                    connections.add([node, otherNode].sort((a, b) => a - b).join(","));
                }
            }
            return connections;
        },
        size() {
            return 45 * this.maze.currentSize + 50;
        }
    },
    methods: {
        reset() {
            Graphs.newGraph();
        }
    },
    template: `
    <div>
        <br>
        <button @click="reset">Reroll Maze</button>
        <div class="l-maze">
            <maze-node
                v-for="(_, nodeId) in maze.graph"
                :key="nodeId + '-maze-node'"
                :id="nodeId"
            />
            <svg :style="{
                width: size,
                height: size
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