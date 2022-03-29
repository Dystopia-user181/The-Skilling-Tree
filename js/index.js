function funcOrConst(x, ...args) {
    return typeof x === "function" ? x(...args) : x;
}

function objectMapping(x, func) {
    const y = {};
    for (const i in x) {
        y[i] = func(x[i], i);
    }
    return y;
}

function matchBits(bits, id) {
    return Boolean(bits & (1 << id))
}

class NotImplementedError extends Error {
    constructor() {
      super("The method is not implemented.");
      this.name = "NotImplementedError";
    }
}