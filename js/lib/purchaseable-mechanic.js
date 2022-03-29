import { GameMechanicState } from "./game-mechanic.js";

export class PurchaseableMechanicState extends GameMechanicState {
    get currency() { throw NotImplementedError(); }

    get cost() {
        if (this.costArgs) return funcOrConst(this.config.cost, ...this.costArgs);
        return funcOrConst(this.config.cost);
    }

    get canBeBought() {
        return this.currency.gte(this.cost);
    }

    purchase() {
        if (this.canBeBought) {
            this.currency.purchase(this.cost);
            this.onPurchase();
            this.config.onPurchase?.();
        }
    }
}