import { fLog } from './instance.js';
function httpHandler (message) {
    if (message.method === "get") {
        fLog("GET request received!");
    }
    if (message.method === "post") {
        fLog("POST request received!");
    }
    if (message.text) process.send({ type: "http", id:message.id, text: "hallo"});
    if (!message.text) process.send({ type: "http", id:message.id, text: message.text});
}

export { httpHandler };