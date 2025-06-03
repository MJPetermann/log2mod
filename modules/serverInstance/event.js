import { events } from "./eventList.js";
import { instance } from './instance.js';
import { handleActivePlayerEvent } from "./features/players.js";

const eventListeners = {};
let jsonBuffer = '';
let inJsonBlock = false;
function handleLogs(logs) {
    // console.time('handleLogs');
    for (const line of logs.split('\n')) {
        let logLine = line.slice(28);
        if (logLine.length < 1) continue;
        if (inJsonBlock) {
            if (logLine.startsWith('JSON_BEGIN')) {
                logLine = logLine.substring('JSON_BEGIN'.length);
            }

            if (logLine.endsWith('}}JSON_END')) {
                inJsonBlock = false;
                let jsonPart = logLine.substring(0, logLine.length - 'JSON_END'.length);
                if (jsonPart.endsWith('}')) {
                    jsonPart = jsonPart.substring(0, jsonPart.length - 1);
                }
                jsonBuffer += jsonPart;
                jsonBuffer += '}';

                let correctedJsonString = jsonBuffer.replace(/("[^"]*")\s*("[^"]*"\s*:)/g, '$1,$2');
                correctedJsonString = correctedJsonString.replace(/("fields"\s*:\s*".*?")("players"\s*:\s*\{)/g, '$1,$2');

                try {
                    const json = JSON.parse(correctedJsonString);
                    const fields = getFields()
                    function getFields() {
                        let returnvalue = [];
                        json.fields.split(',').forEach((field) => {
                            returnvalue.push(field.replaceAll(" ", ''));
                        })
                        return returnvalue
                    };
                    
                    for (let player in json.players) {
                        let playerString = json.players[player];
                        let index = 0;
                        json.players[player] = {}
                        playerString.split(',').forEach((playerData) => {
                            json.players[player][fields[index]] = Number(playerData);
                            index++;
                        });
                        
                    }
                    emitEvent("json", json);
                } catch (e) {
                    console.error('Error parsing JSON:', e);
                    console.error('Buffer (after correction):', correctedJsonString);
                } finally {
                    jsonBuffer = '';
                }
                continue;
            }
            jsonBuffer += logLine;
            continue;
        }
        
        if (logLine === "JSON_BEGIN{") {
            inJsonBlock = true;
            jsonBuffer = '{';
            continue;
        }

        for (const event of events) {
            const match = logLine.match(event.regex);
            if (match) {
                const data = event.format(match, {player: handleActivePlayerEvent});
                emitEvent(event.name, data);
                break;
            }
        }
    }
    // console.timeEnd('handleLogs');
}

function emitEvent(event, data) {
    instance.log(`Event: ${event}`, data);
    if (eventListeners[event]) {
        for (const listener of eventListeners[event]) {
            listener(data);
        }
    }
    // console.log ("Event: " + event , data);
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

export { emitEvent, handleLogs, registerListener }