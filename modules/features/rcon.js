import Rcon from 'rcon';

export const colors = [
    { name: 'white', code: '\u0001' },          // #FFFFFF
    { name: 'lightRed', code: '\u000F' },       // #FF5555
    { name: 'red', code: '\u0007' },            // #FF4343
    { name: 'darkRed', code: '\u0002' },        // #FF0000
    { name: 'lightGreen', code: '\u0005' },     // #C0FF91
    { name: 'lime', code: '\u0006' },           // #A3FF48
    { name: 'green', code: '\u0004' },          // #41FF41
    { name: 'grey', code: '\u0008' },           // #D6DCE0
    { name: 'yellow', code: '\u0009' },         // #FFF584
    { name: 'orange', code: '\u0010' },         // #FCC241
    { name: 'blue', code: '\u000B' },           // #6AAAF1
    { name: 'darkBlue', code: '\u000C' },       // #5474FF
    { name: 'lightPurple', code: '\u0003' },    // #C489FC
    { name: 'purple', code: '\u000E' },         // #E832FB
    { name: 'darkPurple', code: '\u000D' },     // #964FFF
  ];

// for tests
async function rconCommandTest(server, commands){
     {
        for (const command of commands) {
            server.log("RCON: "+command)
        }
        return "rcon-response"
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
        editedText.push(replaceColour("say " + text))
    }
    sendCommands(server, editedText)
}

function replaceColour(text){
    let tempText = text
    for (const colour of colors){
        tempText = tempText.replaceAll(("{"+colour.name+"}"), colour.code)
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