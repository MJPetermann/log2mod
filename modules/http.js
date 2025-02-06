import {app} from '../log2mod.js';
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

    serverProcessInstance.route = new express.Router();
    app.use("/" + serverInstanceName, function replacebleRouter (req, res, next) {serverProcessInstance.route(req, res, next)});

    serverProcessInstance.route.get('/', async (req, res) => {
        await sendMessage(serverProcessInstance, { type: "http" }, (message) => {
            res.send(message);
        });
    });

    const pluginRoute = new express.Router();
    serverProcessInstance.route.use("/plugin", function replacebleRouter (req, res, next) {pluginRoute(req, res, next)});

    pluginRoute.get('/', async (req, res) => {
        await sendMessage(serverProcessInstance, { type: "http", text: "plugin" }, (message) => {
            res.send(message);
        });
    });
}

function reloadServerRoute(serverInstanceName) {
    const serverProcessInstanceIndex = serverProcesses.findIndex(serverProcess => serverProcess.cfg.name === serverInstanceName);
    if (serverProcessInstanceIndex === -1) return throwError("Error while trying to attach Sends Handler: Instance of " + serverInstanceName + " not found!", true);

    const serverProcessInstance = serverProcesses[serverProcessInstanceIndex];

    serverProcessInstance.route = new express.Router();

    serverProcessInstance.route.get('/', async (req, res) => {
        await sendMessage(serverProcessInstance, { type: "http", text: "neuer Server" }, (message) => {
            res.send(message);
        });
    });
}

function createRoute(serverInstanceName) {
    const serverProcessInstanceIndex = serverProcesses.findIndex(serverProcess => serverProcess.cfg.name === serverInstanceName);
    if (serverProcessInstanceIndex === -1) return throwError("Error while trying to attach Sends Handler: Instance of " + serverInstanceName + " not found!", true);

    const serverProcessInstance = serverProcesses[serverProcessInstanceIndex];
}

export { httpHandler, createServerRoute, reloadServerRoute };