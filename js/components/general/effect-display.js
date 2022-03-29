Components.add({
    name: "effect-display",
    props: {
        config: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            effectDisplay: ""
        }
    },
    computed: {
        isValid() {
            return this.config.config.effect && typeof this.config.config.formatEffect === "function";
        }
    },
    methods: {
        update() {
            this.effectDisplay = this.config.config.formatEffect(this.config.effectOrDefault());
        }
    },
    template: `
    <span v-if="isValid">
        {{ effectDisplay }}
    </span>`
})