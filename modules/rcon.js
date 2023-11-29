import Rcon from 'rcon';


export async function sendCommands(server, commands) {
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

export async function checkServer(server) {
    return new Promise((resolve, reject) => {
        try {
            const connection = new Rcon(server.ip, server.port, server.rconPassword);

            connection.on('auth', () => {
                // Authentication succeeded, which means the server is online
                connection.send("status")
            }).on('error', (err) => {
                console.log(err)
                connection.disconnect(); // Disconnect the RCON connection
                resolve(false); // Server is offline or not reachable
            }).on("response", (res) => {
                connection.disconnect()
                resolve(res)
            });

            connection.connect();
        } catch (error) {
            console.log(error)
            resolve(false); // Server is offline or not reachable
        }
    })
}

export async function sendSayCommands(server, texts) {
    const editedText = []
    for (const text of texts){
        editedText.push("say " + text)
    }
    sendCommands(server, editedText)
}