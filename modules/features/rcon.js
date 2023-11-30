import Rcon from 'rcon';

// for tests
async function rconCommandTest(server, commands){
     {
        console.log("SERVER: "+ server.name + ", RCON commands sent START")
        for (const command of commands) {
            console.log(command)
        }
        console.log("SERVER: "+ server.name + ", RCON commands sent END")
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
                console.log(err)
                connection.disconnect()
                resolve(false)
            }).on("response", (res) => {
                connection.disconnect()
                resolve(res)
            });

            connection.connect();
        } catch (error) {
            console.log(error)
            resolve(false);
        }
    })
}

async function sendSayCommands(server, texts) {
    const editedText = []
    for (const text of texts){
        editedText.push("say " + text)
    }
    sendCommands(server, editedText)
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