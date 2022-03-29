export class GameMechanicState {
    constructor(config) {
        this.config = config;
    }

    get id() {
        return this.config.id;
    }

    get canBeApplied() {
        return true;
    }

    get isUnlocked() {
        return funcOrConst(this.config.isUnlocked ?? true);
    }

    get effectValue() {
        return funcOrConst(this.config.effect);
    }

    effectOrDefault(x = this.config.default) {
        if (this.canBeApplied) return this.effectValue;
        else return x;
    }
}