import express from 'express'
import serverjson from './cfg/serverlist.json' assert {type: 'json'}
import log2modConfig from "./cfg/log2mod.json" assert {type: 'json'}
import { initServerlist, serverManagers } from './modules/serverManager.js';
import { matchEvent } from './modules/eventManager.js';
import cors from 'cors'

const app = express();

const corsOptions = {
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions)); // Use the cors middleware with your options

await initServerlist(serverjson.servers, app)
const servers = serverManagers


app.use(express.text())

const port = log2modConfig.port;

app.post('/', (req, res) => {
    const content = req.body;
    const reqServer = req.get('x-server-addr');

    eventLog(reqServer, content)

    res.sendStatus(200);
});

app.listen(port, () => {
    console.log(`Log2mod is ready!`)
});

async function eventLog(serverip, logs) {
    const server = servers.filter((server) => (server.publicIp + ":" + server.port) == serverip)[0]
    if (!server) {
        console.log(serverip + " not a server")
        return
    }
    for (const line of logs.split('\n')) {
        if (!line) return
        await matchEvent(server, line.slice(28));
    }
}