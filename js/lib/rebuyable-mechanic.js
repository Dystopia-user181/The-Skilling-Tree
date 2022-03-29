class BitPurchaseableState extends GameMechanicState {
    get currency() { throw NotImplementedError(); }

    get rebuyableData() { throw NotImplementedError(); }

    get id() {
        return this.config.id;
    }

    get amount() {
        return this.rebuyableData[this.id];
    }

    set amount(value) {
        this.rebuyableData[this.id] = value;
    }

    get canBeApplied() {
        return this.amount > 0;
    }

    get effectValue() {
        return funcOrConst(this.config.effect, this.amount);
    }

    get cost() {
        return funcOrConst(this.config.cost, this.amount);
    }

    get canBeBought() {
        return this.currency.gte(this.cost);
    }

    purchase() {
        if (this.currency.purchase(this.cost)) {
            this.amount++;
        }
    }
}