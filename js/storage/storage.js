import { Migrations } from "./migrations.js";

let request;
let db;

export const GameStorage = {
    save() {
        player.options.lastSaveTimer = Date.now();
        let transaction = db.transaction(["data"], "readwrite");
        transaction.objectStore("data").delete("1");
        transaction = db.transaction(["data"], "readwrite");
        transaction.onerror = function() {
            Notifier.error("Could Not Save.");
        };
        let objectStore = transaction.objectStore("data");
        let objectStoreRequest = objectStore.add({player, id: "1"});
        objectStoreRequest.onsuccess = function(event) {
            console.log("Saved.");
        }
    },
    load() {
        player = getStartPlayer();
        const localStorageItem = localStorage.getItem(this.saveKey);
        if (localStorageItem) {
            player = JSON.parse(localStorageItem);
            localStorage.removeItem(this.saveKey);
            this.normalisePlayer();
        }
        if (!window.indexedDB) {
            return;
        }
        request = indexedDB.open(this.saveKey, 1);
        request.onerror = function(event) {
            alert("Couldn't load save");
            EventHub.dispatch(GAME_EVENTS.AFTER_PLAYER_LOAD);
        };
        request.onupgradeneeded = function(event) {
            db = event.target.result;
            const objectStore = db.createObjectStore("data", {keyPath: "id"});
            objectStore.transaction.oncomplete = function(event) {
                db.transaction("data", "readwrite").objectStore("data").add({player, id: "1"});
                EventHub.dispatch(GAME_EVENTS.AFTER_PLAYER_LOAD);
            }
        };
        request.onsuccess = () => {
            db = request.result;
            let transaction = db.transaction("data");
            transaction.objectStore("data").get("1").onsuccess = event => {
                let data = event.target.result;
                if (data) {
                    player = deepcopy(data.player);
                    this.normalisePlayer();
                    this.migratePlayer(player);
                    EventHub.dispatch(GAME_EVENTS.AFTER_PLAYER_LOAD);
                }
            }
            
            db.onerror = function(event) {
                console.error("Database error: " + event.target.errorCode);
                alert("Couldn't load save");
                EventHub.dispatch(GAME_EVENTS.AFTER_PLAYER_LOAD);
            };
        };
    },
    hardReset() {
        if (confirm("Hard reset?")) {
            indexedDB.deleteDatabase(this.saveKey);
            location.reload();
        }
    },
    normalisePlayer(playerObj = player, defaultObj = getStartPlayer()) {
        for (const i in defaultObj) {
            const prop = defaultObj[i];
            if (playerObj[i] === undefined || playerObj[i].constructor !== prop.constructor) {
                playerObj[i] = prop;
            } else if (prop.constructor === Object) {
                this.normalisePlayer(playerObj[i], prop);
            }
        }
    },
    migratePlayer(player) {
        for (let i = player.version; i < Migrations.length; i++) {
            Migrations[i](player);
            player.version = i + 1;
        }
    },
    get saveKey() {
        return "BFS-DFS-ScarletDys-22fools"
    }
};