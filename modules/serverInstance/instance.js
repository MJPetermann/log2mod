import { httpHandler } from './http.js';
import { handleLogs } from './event.js';

var serverConfig = {}
var serverRoute = null
// first message is always the heartbeat
process.send({ type: "hb", pid: process.pid });

process.once('message', (message) => {
    if (message.type === "init") initServer(message);
});

async function initServer(message) {       
    serverConfig = message.cfg;
    
    // init Heartbeat
    setInterval(() => {
        process.send({ type: "hb", pid: process.pid });
    }, 1000);
    handleMessages();
    fLog("Server initialized!");
}

function handleMessages() {
    process.on('message', (message) => {
        console.log("Handling message: " + message.type);
        if (message.type === "instr") {
            if (message.instr === "shutdown") {
                process.exit();
            }
        }
    
        if (message.type === "http") {
            httpHandler(message)
        }

        if (message.type === "log") {
            handleLogs(message.logs)
        }
    });
    
}

function fLog(message) {
    console.log(serverConfig.name + "@" + serverConfig.ip + " - " + message);
}