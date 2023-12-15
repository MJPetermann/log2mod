import { events } from "./eventList.js";

async function matchEvent(server, line){
    for (const event of events){
        const match = line.match(event.regex)
        
        if(!match) continue

        const data = event.format(match, server)
        server.emit(event.name, data)
    }
}

export {matchEvent}