function mergeIntoGlobal(obj) {
    for (const i in obj) {
        window[i] = obj[i];
    }
}

import "./extensions.js";

import * as lib from "./lib/index.js";
mergeIntoGlobal(lib);

import * as core from "./core/index.js";
mergeIntoGlobal(core);

import * as storage from "./storage/index.js";
mergeIntoGlobal(storage);

import * as ui from "./components/index.js";
mergeIntoGlobal(ui);