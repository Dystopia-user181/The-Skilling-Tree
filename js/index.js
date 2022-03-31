function mergeIntoGlobal(obj) {
    for (const i in obj) {
        window[i] = obj[i];
    }
}

import "./extensions.js";

import * as lib from "./lib/index.js";
import * as core from "./core/index.js";
import * as storage from "./storage/index.js";
import * as ui from "./components/index.js";

mergeIntoGlobal(core);
mergeIntoGlobal(storage);
mergeIntoGlobal(lib);
mergeIntoGlobal(ui);