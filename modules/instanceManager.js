import { fork } from 'child_process'
import { attachSendsHandler } from './instanceCommunication.js';
import { createServerRoute, reloadServerRoute } from './http.js';

const serverProcesses = [];

function createNewInstance(serverConfig) {
    return new Promise((resolve, reject) => {
        const serverProcess = fork('./modules/serverInstance/instance.js');
        serverProcesses.push({ status: "init", cfg: serverConfig, process: serverProcess });
        const timeout = setTimeout(() => {
            deleteInstance(serverConfig);
            throwError("Error while trying to create Instance: Instance of " + serverConfig.name + " did not respond in time!", false);
        }, 1500);
        
        serverProcess.once('message', (message) => { 
            if (message.type === "hb" && !(timeout._destroyed)) resolve(serverConfig.name);
            clearTimeout(timeout);
            createServerRoute(serverConfig.name)
        });
    });
}

function deleteInstance(serverConfig) {
    return new Promise((resolve, reject) => {
        const serverProcessInstanceIndex = serverProcesses.findIndex(serverProcess => serverProcess.cfg.name === serverConfig.name);
    	if (serverProcessInstanceIndex === -1) return throwError("Error while trying to delete Instance: Instance of " + serverConfig.name + " not found!", true);
        
        const serverProcessInstance = serverProcesses[serverProcessInstanceIndex];

        if (serverProcessInstance.status == "crashed") {
            if (serverProcessInstance.process.connected !== false) serverProcessInstance.process.kill();
            serverProcessInstance.status = "deleted";
            return resolve(true)
        };
        
        if (serverProcessInstance.status == "deleted") return throwError("Error while trying to delete Instance: Instance of " + serverConfig.name + " was already deleted!", true);
        if (serverProcessInstance.process === null) return throwError("Error while trying to delete Instance: Instance of " + serverConfig.name + " was already deleted!", true);

        const timeout = setTimeout(() => {
            serverProcessInstance.process.kill();
            serverProcessInstance.status = "deleted";
            serverProcessInstance.process = null;
            throwError("Error while trying to delete Instance: Instance of " + serverConfig.name + " did not respond to shutdown command!", false);
            resolve(true);
        }, 500);

        serverProcessInstance.process.send({ type: "instr", instr: "shutdown" });
        serverProcessInstance.process.once('exit', (code, signal) => {
            serverProcessInstance.status = "deleted";
            serverProcessInstance.process = null;
            clearTimeout(timeout);
            resolve(true);
        });
    });
}

async function reactivateInstance(serverConfig) {
    const serverProcessInstanceIndex = serverProcesses.findIndex(serverProcess => serverProcess.cfg.name === serverConfig.name);
    if (serverProcessInstanceIndex === -1) return throwError("Error while trying to reactivate Instance: Instance of " + serverConfig.name + " not found!", true);
    if (serverProcesses[serverProcessInstanceIndex].status !== "deleted") return throwError("Error while trying to reactivate Instance: Instance of " + serverConfig.name + " is already active!", true);

    return new Promise((resolve, reject) => {
        const serverProcess = fork('./modules/serverInstance/instance.js');
        serverProcesses[serverProcessInstanceIndex] = { status: "init", cfg: serverConfig, process: serverProcess, crashCount: serverProcesses[serverProcessInstanceIndex].crashCount };
        const timeout = setTimeout(() => {
            deleteInstance(serverConfig);
            throwError("Error while trying to create Instance: Instance of " + serverConfig.name + " did not respond in time!", false);
        }, 1500);
        serverProcess.once('message', (message) => { 
            if (message.type === "hb" && !(timeout._destroyed)) resolve(serverConfig.name);
            clearTimeout(timeout);
            reloadServerRoute(serverConfig.name)
        });
    });
}

async function reloadInstance(serverName) {
    const serverProcessInstanceIndex = serverProcesses.findIndex(serverProcess => serverProcess.cfg.name === serverName);
    if (serverProcessInstanceIndex === -1) return throwError("Error while trying to reload Instance: Instance of " + serverName + " not found!", true);
    
    const serverProcessInstance = serverProcesses[serverProcessInstanceIndex];
    
    if (serverProcessInstance.status == "deleted") return throwError("Error while trying to reload Instance: Instance of " + serverName + " was deleted!", true);

    await deleteInstance(serverProcessInstance.cfg);
    console.log(await createNewInstance(serverProcessInstance.cfg));
}

async function loadServerConfig(serverConfig) {
    if (!serverConfig.name) return throwError("Error while trying to load Server Config: Server Config of has no name!", false);
    const serverProcessInstanceIndex = serverProcesses.findIndex(serverProcess => serverProcess.cfg.name === serverConfig.name);
    if (serverProcessInstanceIndex !== -1) return throwError("Error while trying to load Server Config: Server " + serverConfig.name + " is already loaded!", false);

    let serverInstanceName = await createNewInstance(serverConfig);
    attachSendsHandler(serverInstanceName);
}

async function reloadServerConfig(serverConfig) {
    const serverProcessInstanceIndex = serverProcesses.findIndex(serverProcess => serverProcess.cfg.name === serverConfig.name);
    if (serverProcessInstanceIndex === -1) return throwError("Error while trying to reload Server Config: Server " + serverConfig.name + " not found!", false);

    await deleteInstance(serverConfig)
    let serverInstanceName = await reactivateInstance(serverConfig);
    attachSendsHandler(serverInstanceName);
}

function throwError(message, crash) {
    if (crash) throw new Error(message);
    console.error(message);
    return "Non fatal error accoured in instanceHander.js: " + message;
}





export { serverProcesses, loadServerConfig, reloadServerConfig, reactivateInstance};