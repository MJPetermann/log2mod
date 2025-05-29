import {instance} from './instance.js';

const routes = {};

function httpHandler (message) {
    if (message.method === "get") {
        instance.log("GET request received! " + message.req.path);
        // process.send({ type: "http", id:message.id, response: {status: 200 , body: "hallo"}})
        checkAndExecuteRoute(message);
        return;
    }
    if (message.method === "post") {
        instance.log("POST request received!");
        process.send({ type: "http", id:message.id, response: {status: 200 , body: "hallo"}})
    }
}

function addRoute(inputRoute, method, route) {
    inputRoute = cleanupRouteInput(inputRoute);
    if (routes[inputRoute]) {
        instance.log(`Route ${inputRoute} already exists, overwriting...`);
    }
    if (typeof route !== 'function') {
        instance.log(`Invalid route for ${inputRoute}. Route must be a function.`);
        return;
    }
    routes[inputRoute] = {method: method, route: route};
    instance.log(`Route ${inputRoute} added successfully.`);
}

function checkAndExecuteRoute(message) {
    let inputRoute = cleanupRouteInput(message.req.path)
 
    if (routes[inputRoute] && routes[inputRoute].method === message.method) {
        try {
            routes[inputRoute].route(message.req, (res) => {
                if (res && res.status && res.body) {
                    process.send({ type: "http", id: message.id, response: { status: res.status, body: res.body } });
                } else {
                    process.send({ type: "http", id: message.id, response: { status: 200, body: "OK" } });
                }
            });
        } catch (error) {
            instance.log(`Error executing route ${inputRoute}: ${error.message}`);
            process.send({ type: "http", id: message.id, response: { status: 500, body: "Internal Server Error" } });
        }
    } else {
        instance.log(`Route ${inputRoute} not found.`);
        process.send({ type: "http", id: message.id, response: { status: 404, body: "Not Found" } });
    }
}

function cleanupRouteInput(route) {
    let tempRoute = route.split('/');
    tempRoute = tempRoute.filter(part => part !== '');
    return tempRoute.join('/');
}

export { httpHandler, addRoute };