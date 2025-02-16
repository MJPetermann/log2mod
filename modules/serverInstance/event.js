import { events } from "./eventlist.js";
import { getPlayer } from "./features/players.js";

const server = { player: {get: (server, playerdata) => {return getPlayer(playerdata)}}};

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

export { handleLogs }