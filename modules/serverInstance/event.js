import { events } from "./eventlist.js";
import { getPlayer } from "./features/players.js";

const eventListeners = {};

function handleLogs(logs) {
    console.time('handleLogs');
    for (const line of logs.split('\n')) {
        for (const event of events) {
            const match = line.slice(25).match(event.regex);
            if (match) {
                const data = event.format(match, getPlayer);
                console.log(event.name, data);
                break;
            }
        }
    }
    console.timeEnd('handleLogs');
}

function emitEvent(event, data) {
    if (eventListeners[event]) {
        for (const listener of eventListeners[event]) {
            listener(data);
        }
    }
}

function registerListener(event, callback) {
    if (events.find(e => e.name === event) === undefined) return throwError(`Event ${event} does not exist`);
    if (!eventListeners[event]) eventListeners[event] = [];
    eventListeners[event].push(callback);
}

function throwError(message, crash) {
    if (crash) throw new Error(message);
    console.error(message);
    return "Non fatal error accoured in instanceHander.js: " + message;
}

export { handleLogs }