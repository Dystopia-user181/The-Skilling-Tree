export class EventHub {
    constructor() {
        this._handlers = {};
    }
  
    on(event, fn, target) {
        let handlers = this._handlers[event];
        if (handlers === undefined) {
            handlers = [];
            this._handlers[event] = handlers;
        }
        handlers.push({ fn, target });
    }
  
    offAll(target) {
        for (const handlers of Object.keys(this._handlers)) {
            this._handlers[handlers] = this._handlers[handlers]
                .filter(handler => handler.target !== target);
        }
    }
  
    // eslint-disable-next-line max-params
    dispatch(event, args) {
        const handlers = this._handlers[event];
        if (handlers === undefined) return;
        for (const handler of handlers) {
            handler.fn(args);
        }
    }
  
    // eslint-disable-next-line max-params
    static dispatch(event, ...args) {
        EventHub.logic.dispatch(event, args);
        GameUI.dispatch(event, args);
    }
};
  
EventHub.logic = new EventHub();
EventHub.ui = new EventHub();

window.GAME_EVENTS = {
    UPDATE: "UPDATE",

    MAZE_MOVED: "MAZE_MOVED",
    MAZE_RESET_PROGRESS: "MAZE_RESET_PROGRESS",
    NEW_MAZE: "NEW_MAZE",
};