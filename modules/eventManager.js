import { events } from "./eventList.js";

async function matchEvent(server, line){
    for (const event of events){
        const match = line.match(event.regex)
        
        if(!match) continue

        const data = event.format(match)
        console.log(event.name + " on " + server.name)

        server.emit(event.name, data)
    }
}

export {matchEvent}