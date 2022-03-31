Vue.component("effect-display", {
    props: {
        config: {
            type: Object,
            required: true
        },
        label: {
            type: String,
            required: false,
            default: "Currently: "
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
            if (!this.isValid) return;
            this.effectDisplay = this.config.config.formatEffect(this.config.effectValue);
        }
    },
    template: `
    <span v-if="isValid">
        {{ label }}{{ effectDisplay }}
    </span>`
})