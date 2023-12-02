import Rcon from 'rcon';

const colours = [
    {name:"default", colour:""},
    {name:"white", colour:""},
    {name:"green", colour:""},
    {name:"blue", colour:""},
    {name:"dark blue", colour:""},
    {name:"dark red", colour:""},
    {name:"gold", colour:""},
    {name:"light green", colour:""},
    {name:"light red", colour:""},
    {name:"light green", colour:""},
    {name:"pink", colour:""},
    {name:"pale red", colour:""},
    {name:"light blue", colour:""},
    {name:"yellow", colour:"	"},
]

// for tests
async function rconCommandTest(server, commands){
     {
        for (const command of commands) {
            server.log("RCON: "+command)
        }
        return true
    }
}

async function rconCheckTest(server){
    return "udp/ip   : 192.168.178.38:27015 (public "+ server.config.publicIp + ":" + server.port + ")"
}

// functional code
async function sendCommands(server, commands) {
    if (server.config.test) return rconCommandTest(server, commands)
    return new Promise((resolve, reject) => {
        try {
        const connection = new Rcon(server.ip, server.port, server.rconPassword);
        connection.on('auth', () => {
            for (const command of commands) {
                connection.send(command)
            }
        }).on('error', (err) => {
            console.log("error " + err);
            connection.disconnect()
            server.active = false
            reject(err)
            
        }).on("response", (res) => {
            connection.disconnect()
            resolve(res)
        })
        connection.connect()
        } catch (error) {
            server.active = false
        console.error("Rcon connection error: " + error);
        reject(err); // Server is offline or not reachable
        }
    })
}

async function checkServer(server) {
    if (server.config.test) return await rconCheckTest(server)
    return new Promise((resolve, reject) => {
        try {
            const connection = new Rcon(server.ip, server.port, server.rconPassword);

            connection.on('auth', () => {
                connection.send("status")
            }).on('error', (err) => {
                server.log("RCON: "+ err)
                connection.disconnect()
                resolve(false)
            }).on("response", (res) => {
                connection.disconnect()
                resolve(res)
            });

            connection.connect();
        } catch (error) {
            server.log("RCON: "+error)
            resolve(false);
        }
    })
}

async function sendSayCommands(server, texts) {
    const editedText = []
    for (const text of texts){
        editedText.push(await replaceColour("say " + text))
    }
    sendCommands(server, editedText)
}

async function replaceColour(text){
    let tempText = text
    for (const colour of colours){
        tempText = tempText.replaceAll(("{"+colour.name+"}"), colour.colour)
    }
    return tempText
}

export async function loadRcon(server)
{
    server.Rcon = (commands) => {
        return sendCommands(server, commands)
    }
    server.sayRcon = (messages) => {
        return sendSayCommands(server, messages)
    }
    server.statusRcon = () => {
        return checkServer(server)
    }
}