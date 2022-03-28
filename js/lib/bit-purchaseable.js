class BitPurchaseableState extends GameMechanicState {
    get currency() { throw NotImplementedError(); }

    get bits() { throw NotImplementedError(); }

    set bits(value) { throw NotImplementedError(); }

    get id() {
        return this.config.id;
    }

    get canBeApplied() {
        return matchBits(this.bits, this.id);
    }

    get effectValue() {
        return funcOrConst(this.config.effect);
    }

    get cost() {
        return funcOrConst(this.config.cost);
    }

    get canBeBought() {
        return this.currency.gte(this.cost);
    }

    purchase() {
        if (this.currency.purchase(this.cost)) {
            this.bits |= 1 << this.id;
        }
    }
}