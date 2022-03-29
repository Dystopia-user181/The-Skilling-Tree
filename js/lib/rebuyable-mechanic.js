import { PurchaseableMechanicState } from "./purchaseable-mechanic.js";

export class RebuyableMechanicState extends PurchaseableMechanicState {
    get rebuyableData() { throw NotImplementedError(); }

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

    get costArgs() {
        return [this.amount];
    }

    get canBeBought() {
        return this.currency.gte(this.cost);
    }

    get defaultAmount() {
        return funcOrConst(this.config.defaultAmount ?? 0);
    }

    onPurchase() {
        this.amount++;
    }

    static initPlayer(rebuyables) {
        const rebuyableData = {};
        for (const idx in rebuyables) {
            const rebuyable = rebuyables[idx];
            if (rebuyable instanceof this) {
                rebuyableData[idx] = rebuyable.defaultAmount;
            }
        }
        return rebuyableData;
    }
}