import { PurchaseableMechanicState } from "./purchaseable-mechanic.js";

export class BitPurchaseableState extends PurchaseableMechanicState {
    get bits() { throw NotImplementedError(); }

    set bits(value) { throw NotImplementedError(); }

    get canBeApplied() {
        return matchBits(this.bits, this.id);
    }

    get canBeBought() {
        return super.canBeBought && !this.canBeApplied;
    }

    onPurchase() {
        this.bits |= 1 << this.id;
    }
}