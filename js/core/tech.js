import { RebuyableMechanicState } from "../lib/rebuyable-mechanic.js";
import { GameDatabase } from "../database/game-database.js";

export const Tech = {
    get bothGain() {
        let gain = 0;
        for (const building of Object.values(TechBuildings)) {
            gain += building.effectValue;
        }
        return gain * this.tickspeed.effectValue;
    },
    get inflatonGain() {
        return this.bothGain + PickapathUpgrades.techPair.inflaton.effectOrDefault();
    },
    get electronGain() {
        return this.bothGain + PickapathUpgrades.techPair.electron.effectOrDefault();
    },

    tickspeed: new class extends RebuyableMechanicState {
        constructor() {
            const config = {
                id: "tickspeed",
                cost: x => 2 ** (x ** 1.4) * 1e5,
                effect: x => (1 + player.tech.buildings.galaxy) ** x,
                formatEffect: x => `x${format(x, 2, 2)}`,
                isUnlocked: () => player.tech.buildings.galaxy >= 1
            };
            super(config);
        }

        get currency() { return Currency.inflatons; }

        get rebuyableData() { return player.tech; }
    },
    
    gameLoop(diff) {
        Currency.inflatons.add(this.inflatonGain * diff / 1000);
        Currency.electrons.add(this.electronGain * diff / 1000);
    }
}

export class TechBuildingState extends RebuyableMechanicState {
    get currency() { return Currency.electrons; }

    get rebuyableData() { return player.tech.buildings; }
}

export const TechBuildings = objectMapping(GameDatabase.tech.buildings, x => new TechBuildingState(x));