import express from 'express'
import cors from 'cors'
import {loadServerConfig, reloadServerConfig} from './modules/instanceManager.js'
import { reloadServerRoute } from './modules/http.js'

import { fork } from 'child_process'
import serversOnStartup from './cfg/serversOnStartup.json' with {type: 'json'}
const app = express();

const corsOptions = {
    origin: "*",
    methods: ["GET,HEAD,PUT,PATCH,POST,DELETE"],
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true
};

app.use(cors(corsOptions)); // Use the cors middleware with your options



serversOnStartup.servers[0] = 
    {
            "name": "example",
            "ip": "172.0.0.1",
            "port": "27015",
            "rconPassword": "hallo123",
            "config": {
                "test": true,
                "active": false,
                "autoloadPlayerlist": false,
                "plugins": [
                    "simpleCommands"
                ],
                "permissions": {
                    "default": {
                        "permissions":["basic.*"]
                    },
                    "admin": {
                        "permissions":["*"],
                        "players": ["U:1:395318202"]
                    }
                }
            }
        }

// loadServerConfig(serversOnStartup.servers[0])
// setTimeout(() => {
//     loadServerConfig(serversOnStartup.servers[1])
// }, 500);

for (let i = 0; i < serversOnStartup.servers.length; i++) {
    loadServerConfig(serversOnStartup.servers[i])
}
// setTimeout(() => {
//     reloadServerRoute(serversOnStartup.servers[0].name)
// }, 10000);

// app.get('/createRoute', (req, res) => {
//     const serverRouter = new express.Router();
//     serverProcesses.push({route: serverRouter});
//     app.use("/test", function replacebleRouter (req, res, next) {serverProcesses[0].route(req, res, next)});

//     serverProcesses[0].route.get('/', (req, res) => {
//         res.send('Original route!');
//     });
//     res.send('Route created!');
// });

// app.get('/changeRoute', (req, res) => {
//     const serverRouter = new express.Router();
//     serverProcesses[0].route = serverRouter;
//     serverProcesses[0].route.get('/', (req, res) => {
//         res.send('Changed route!');
//     });
//     res.send('Route changed!');

// });


app.listen(3000, () => {
    console.log(`Log2mod is ready!`)
});

export {app}