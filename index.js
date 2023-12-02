import express from 'express'
import serverjson from './cfg/serverlist.json' assert {type: 'json'}
import { initServerlist, serverManagers } from './modules/serverManager.js';
import { matchEvent } from './modules/eventManager.js';

await initServerlist(serverjson.servers)
const servers = serverManagers

const app = express();

app.use(express.text())

const port = 3000;

app.post('/', (req, res) => {
    const content = req.body;
    const reqServer = req.get('x-server-addr');

    eventLog(reqServer, content)

    res.sendStatus(200);
});

app.listen(port, () => {
    console.log(`Log2mod is ready!`);
});

async function eventLog(serverip, logs) {
    const server = servers.filter((server) => (server.publicIp + ":" + server.port) == serverip)[0]
    if (!server) {
        console.log(serverip + " not a server")
        return
    }
    for (const line of logs.split('\n')) {
        if (!line) return
        matchEvent(server, line.slice(28));
    }
}