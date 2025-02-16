import { serverProcesses, reactivateInstance } from "./instanceManager.js";

//import event handler
import { EventEmitter } from 'events';
const messageReceived = new EventEmitter();

// Receives messages from server instances and handles them

function attachSendsHandler(serverInstanceName) {
    const serverProcessInstanceIndex = serverProcesses.findIndex(serverProcess => serverProcess.cfg.name === serverInstanceName);
    if (serverProcessInstanceIndex === -1) return throwError("Error while trying to attach Sends Handler: Instance of " + serverInstanceName + " not found!", true);

    const serverProcessInstance = serverProcesses[serverProcessInstanceIndex];

    if (serverProcessInstance.process.connected === false) {
        serverProcessInstance.status = "deleted";
        return throwError("Error while trying to attach Sends Handler: Instance of " + serverInstanceName + " crashed during Startup!", false);
    }
    
    serverProcessInstance.lastHeartbeat = Date.now();
    
    
    serverProcessInstance.process.on('exit', (code, signal) => {
        exitHandler(serverProcessInstance, code, signal);
    });

    serverProcessInstance.process.on('message', (message) => {
        messageHandler(serverProcessInstance, message);
    });
    
    serverProcessInstance.process.send({ type: "init", cfg: serverProcessInstance.cfg });


}
// todo add code / signal
function exitHandler(serverProcessInstance, code, signal) {
    
        if (serverProcessInstance.status === "deleted") return;
        serverProcessInstance.status = "deleted";

        throwError("Error: Instance of " + serverProcessInstance.cfg.name + " crashed! Restarting!", false);

        if(!(serverProcessInstance.crashCount)) serverProcessInstance.crashCount = 0;
        serverProcessInstance.crashCount++;

        if(serverProcessInstance.crashCount > 5) {
            throwError("Error: Instance of " + serverProcessInstance.cfg.name + " crashed too often! Stopping Instance!", false);
            serverProcessInstance.status = "crashed";
            return;
        }
        setTimeout(async () => {
            attachSendsHandler(await reactivateInstance(serverProcessInstance.cfg))
        }, 1000);
}
    
function messageHandler(serverProcessInstance, message) {
    if (message.type === "hb") {
        heartbeatHandler(serverProcessInstance, message);
    }
    if (message.type === "http") {
        messageReceived.emit(message.id, message);
    }

}

function heartbeatHandler(serverProcessInstance, message) {
    const timeoutTime = 1000;
    const hbDelta = Date.now() - serverProcessInstance.lastHeartbeat - timeoutTime
    if (hbDelta > 10) {
        throwError("Error: Instance of " + serverProcessInstance.cfg.name + " did not respond in time!", false);
    }
    serverProcessInstance.lastHeartbeat = Date.now();

     
}

function throwError(message, crash) {
    if (crash) throw new Error(message);
    console.error(message);
    return "Non fatal error accoured in instanceHander.js: " + message;
}

// send message to instance

async function sendMessage(serverProcessInstance, message, callback) {
    if (serverProcessInstance.status === "deleted") return throwError("Error while trying to send Message: Instance of " + serverProcessInstance.cfg.name + " was deleted!", false);
    if (serverProcessInstance.status === "crashed") return throwError("Error while trying to send Message: Instance of " + serverProcessInstance.cfg.name + " crashed!", false);

    message.id = generateMessageId()
    serverProcessInstance.process.send(message);
    if (callback) {
        messageReceived.once(message.id, (reply) => callback(reply));
    }
}

function generateMessageId() {
    let id = "id-"+Math.random().toString(36).substring(7);
    if (id.split("-")[1] === "undefined") return generateMessageId();
    return id;
}

export { attachSendsHandler, sendMessage }; 