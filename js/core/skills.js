import { GameMechanicState, BitPurchaseableState, RebuyableMechanicState } from "../lib/index.js";
import { GameDatabase } from "../database/game-database.js";

export const SkillPoints = {
    get gain() {
        let base = 1 + (player.maze.currentSize - 6) / 2;
        base = base ** PickapathUpgrades.spMultPowPair.power.effectOrDefault();
        return Math.floor(((base * this.multiplier) ** this.power) * this.postPowerMultiplier);
    },

    get multiplier() {
        let multiplier = 1;
        multiplier *= SkillPointUpgrades.times2SP.effectOrDefault();
        multiplier *= PickapathUpgrades.spGainPair.doubleSPGain.effectOrDefault();
        multiplier *= PickapathUpgrades.spGainPair.tripleSPGain.effectOrDefault();
        return multiplier;
    },

    get power() {
        let power = 1;
        power *= SkillPointUpgrades.raiseSPGain1.effectOrDefault();
        return power;
    },

    get postPowerMultiplier() {
        let multiplier = 1;
        multiplier *= SkillPointUpgrades.spMult.effectValue;
        multiplier *= PickapathUpgrades.spMultPowPair.multiply.effectOrDefault();
        return multiplier;
    }
}

export class SkillPointUpgradeState extends BitPurchaseableState {
    get currency() { return Currency.skillPoints; }

    get bits() { return player.skills.skillBits; }

    set bits(value) { player.skills.skillBits = value; }
}

export class SkillPointRebuyableState extends RebuyableMechanicState {
    get currency() { return Currency.skillPoints; }

    get rebuyableData() { return player.skills.rebuyables; }
}

export class PickapathState extends GameMechanicState {
    constructor(config) {
        super(config);
        this.bind(config.upgrades.first, config.upgrades.second);
    }

    bind(upg1, upg2) {
        const thisReference = this;
        this.first = upg1 instanceof GameMechanicState ? upg1 : new GameMechanicState(upg1);
        this.second = upg2 instanceof GameMechanicState ? upg2 : new GameMechanicState(upg2);
        Object.defineProperty(this.first, "canBeApplied", {
            get() {
                return thisReference.chosen === this && thisReference.canBeApplied;
            }
        });
        Object.defineProperty(this.second, "canBeApplied", {
            get() {
                return thisReference.chosen === this && thisReference.canBeApplied;
            }
        });
        this[this.first.id] = this.first;
        this[0] = this.first;
        this[this.second.id] = this.second;
        this[1] = this.second;
        return this;
    }

    get canBeApplied() {
        return this.isUnlocked;
    }

    get bits() { return player.skills.pickapathBits; }

    set bits(value) { player.skills.pickapathBits = value; }

    get chosen() {
        return Boolean(this.bits & (1 << this.id)) ? this.second : this.first;
    }

    choose(x) {
        if (x === PickapathState.first && this.chosen === this.second) {
            this.toggle();
            this.first.config.onChoose?.();
        } else if (x === PickapathState.second && this.chosen === this.first) {
            this.toggle();
            this.second.config.onChoose?.();
        }
    }

    toggle() {
        this.bits ^= 1 << this.id;
    }

    static first = 0;

    static second = 1;
}

export const SkillPointUpgrades = (function() {
    const upgs = objectMapping(GameDatabase.skills.upgrades,
        x => x.isRebuyable ? new SkillPointRebuyableState(x) : new SkillPointUpgradeState(x));

    upgs.singles = filter(upgs, x => x instanceof SkillPointUpgradeState);
    upgs.rebuyables = filter(upgs, x => x instanceof SkillPointRebuyableState);
    
    return upgs;
})();

export const PickapathUpgrades = (function() {
    const upgs = objectMapping(GameDatabase.skills.pickapaths, x => new PickapathState(x));
    
    return upgs;
})();