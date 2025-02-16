import { app } from '../log2mod.js';
import { serverProcesses } from './instanceManager.js';
import { sendMessage } from './instanceCommunication.js';
import express from 'express';

function httpHandler(message) {
    app.get('/', (req, res) => {
        res.send('Hello World!');
    });
}

function createServerRoute(serverInstanceName) {
    const serverProcessInstanceIndex = serverProcesses.findIndex(serverProcess => serverProcess.cfg.name === serverInstanceName);
    if (serverProcessInstanceIndex === -1) return throwError("Error while trying to attach Sends Handler: Instance of " + serverInstanceName + " not found!", true);

    const serverProcessInstance = serverProcesses[serverProcessInstanceIndex];

    const route = new express.Router();
    serverProcesses[serverProcessInstanceIndex].route = route
    app.use("/" + serverInstanceName, function replacebleRouter(req, res, next) { serverProcesses[serverProcessInstanceIndex].route(req, res, next) });

    serverProcesses[serverProcessInstanceIndex].route.get('/', (req, res) => { 
        serverProcesses[serverProcessInstanceIndex].process.kill() 
        res.send(serverProcesses[serverProcessInstanceIndex].status) 
    });

    configureStandardRoute(serverProcessInstanceIndex);
}

function reloadServerRoute(serverInstanceName) {
    const serverProcessInstanceIndex = serverProcesses.findIndex(serverProcess => serverProcess.cfg.name === serverInstanceName);
    if (serverProcessInstanceIndex === -1) return throwError("Error while trying to attach Sends Handler: Instance of " + serverInstanceName + " not found!", true);

    const serverProcessInstance = serverProcesses[serverProcessInstanceIndex];

    const route = new express.Router();
    serverProcesses[serverProcessInstanceIndex].route = route
    console.log("Reloading Route for " + serverProcessInstance.cfg.name);

    configureStandardRoute(serverProcessInstanceIndex);
}

function createRoute(serverInstanceName) {
    const serverProcessInstanceIndex = serverProcesses.findIndex(serverProcess => serverProcess.cfg.name === serverInstanceName);
    if (serverProcessInstanceIndex === -1) return throwError("Error while trying to attach Sends Handler: Instance of " + serverInstanceName + " not found!", true);

    const serverProcessInstance = serverProcesses[serverProcessInstanceIndex];
}

function configureStandardRoute(serverProcessInstanceIndex) {
    console.log("Configuring Standard Route for " + serverProcesses[serverProcessInstanceIndex].cfg.name);
    serverProcesses[serverProcessInstanceIndex].route.use(express.text())
    serverProcesses[serverProcessInstanceIndex].route.post('/', async (req, res) => {

        if (req.get('x-server-addr') === serverProcesses[serverProcessInstanceIndex].cfg.ip) {
            let response = sendMessage(serverProcesses[serverProcessInstanceIndex], { type: "log", logs: req.body })
            if(!(await response)) return res.sendStatus(200);
            res.status(500).send(response);
        } else {
            res.sendStatus(403);
        }
    });

    serverProcesses[serverProcessInstanceIndex].route.get('/', async (req, res) => {
        res.send(serverProcesses[serverProcessInstanceIndex].cfg);
    });
}



export { httpHandler, createServerRoute, reloadServerRoute };