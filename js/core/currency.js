export class Currency {
    get value() { throw new NotImplementedError(); }

    set value(value) { throw new NotImplementedError(); }
  
    add(amount) {
        this.value += amount;
    }
  
    subtract(amount) {
        this.value = Math.max(this.value - amount, 0);
    }
  
    multiply(amount) {
        this.value *= amount;
    }
  
    divide(amount) {
        this.value /= amount;
    }
  
    eq(amount) {
        return this.value === amount;
    }
  
    gt(amount) {
        return this.value > amount;
    }
  
    gte(amount) {
        return this.value >= amount;
    }
  
    lt(amount) {
        return this.value < amount;
    }
  
    lte(amount) {
        return this.value <= amount;
    }
  
    purchase(cost) {
        if (!this.gte(cost)) return false;
        this.subtract(cost);
        return true;
    }
  
    bumpTo(value) {
        this.value = Math.max(this.value, value);
    }
  
    dropTo(value) {
        this.value = Math.min(this.value, value);
    }
  
    get startingValue() { return 0; }
  
    reset() {
        this.value = this.startingValue;
    }
}

Currency.skillPoints = new class extends Currency {
    get value() { return player.skillPoints; }
    set value(x) {
        player.skillPoints = x;
        player.bestSkillPoints = Math.max(player.bestSkillPoints, x);
    }
}

Currency.electrons = new class extends Currency {
    get value() { return player.tech.electrons; }
    set value(x) { player.tech.electrons = Math.min(x, Number.MAX_VALUE); }
}

Currency.inflatons = new class extends Currency {
    get value() { return player.tech.inflatons; }
    set value(x) { player.tech.inflatons = Math.min(x, Number.MAX_VALUE); }
}