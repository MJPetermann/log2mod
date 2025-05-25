import { httpHandler } from './http.js';
import { handleLogs } from './event.js';
import { rcon } from './features/rcon.js'
import l2mConfig from '../../cfg/l2m.json' with {type: 'json'}

var serverConfig
var serverRoute = null
// first message is always the heartbeat
process.send({ type: "hb", pid: process.pid });

process.once('message', (message) => {
    if (message.type === "init") initServer(message);
});

async function initServer(message) {      
    serverConfig = message.cfg;
    console.log("Initializing server: " + serverConfig.name + "@" + serverConfig.ip + ":" + serverConfig.port);

    // init Heartbeat
    setInterval(() => {
        process.send({ type: "hb", pid: process.pid });
    }, 1000);
    setInterval(() => {
        checkServerConnection()
    }, 10000);
    handleMessages();

    initialConnection();

    fLog("Server initialized!");
}

function handleMessages() {
    process.on('message', (message) => {
        fLog("Handling message: " + message.type);
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

async function initialConnection() {
    if(!(await rcon.status())) {
        process.exit();
    }
    serverConfig.publicIp = ((await rcon.status(serverConfig)).match(/udp\/ip\s*:\s*\d+\.\d+\.\d+\.\d+:\d+\s*\(public\s+(\d+\.\d+\.\d+\.\d+):\d+\)/)[1])
    rcon.command(["log on","mp_logdetail 3","mp_logmoney 1","mp_logdetail_items 1","logaddress_add_http \"http://"+l2mConfig.ip+":"+l2mConfig.port+"/"+ serverConfig.name +"/\"", "mp_restartgame 1"]);
    process.send({ type: "publicIp", publicIp: serverConfig.publicIp });
}
    
async function checkServerConnection() {
    if(!(await rcon.status())) {
        process.exit();
    }
}

function fLog(message) {
    console.log(serverConfig.name + "@" + serverConfig.ip + " - " + message);
}

export const instance = { log: fLog, config: function () {return serverConfig} };