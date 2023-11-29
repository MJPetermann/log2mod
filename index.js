import express from 'express'

const app = express();

app.use(express.text())

const serverList = [
    {name: "server1", ip: "172.0.0.1"},
    {name: "server2", ip: "172.0.0.2"},
    {name: "server3", ip: "172.0.0.3"} 
]
const eventList = [
    {name: "event1", text: "hi1"},
    {name: "event2", text: "hi2"},
    {name: "event3", text: "hi3"},
]




async function eventLog(serverip, event){
    for (const testEvent of eventList){
        if (testEvent.name != event) continue
        servers.filter((server)=> server.ip == serverip)[0].emit(testEvent.name, testEvent.text)
    }
}

const servers = await loadServers()
await eventLog("172.0.0.2", "event2")