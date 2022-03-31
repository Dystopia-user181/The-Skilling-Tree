window.funcOrConst = function funcOrConst(x, ...args) {
    return typeof x === "function" ? x(...args) : x;
}

window.filter = function filter(x, fun) {
    const y = {};
    for (const i in x) {
        if (fun(x[i], i)) {
            y[i] = x[i];
        }
    }
    return y;
}

window.objectMapping = function objectMapping(x, fun) {
    const y = {};
    for (const i in x) {
        y[i] = fun(x[i], i);
    }
    return y;
}

window.matchBits = function matchBits(bits, id) {
    return Boolean(bits & (1 << id))
}

window.diSequenceAscending = function sequenceFrom(a, b) {
    if (a > b) {
        return b + "," + a;
    }
    return a + "," + b;
}

window.format = function format(x, places = 2, placesBefore1e6 = 0) {
    if (x < 1e6) return x.toFixed(placesBefore1e6);
    const e = Math.floor(Math.log10(x));
    const m = x / (10 ** e);
    if (x >= 1e6) return `${m.toFixed(places)}e${e}`;
}

window.formatTime = function formatTime(x) {
    if (x < 1e3) return `${format(x)}ms`;
    return `${format(x / 1000, 3, 3)}s`;
}

window.NotImplementedError = class NotImplementedError extends Error {
    constructor() {
      super("The method is not implemented.");
      this.name = "NotImplementedError";
    }
}