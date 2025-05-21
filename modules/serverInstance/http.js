import {instance} from './instance.js';
function httpHandler (message) {
    if (message.method === "get") {
        instance.log("GET request received!");
    }
    if (message.method === "post") {
        instance.log("POST request received!");
    }
    if (message.text) process.send({ type: "http", id:message.id, text: "hallo"});
    if (!message.text) process.send({ type: "http", id:message.id, text: message.text});
}

export { httpHandler };