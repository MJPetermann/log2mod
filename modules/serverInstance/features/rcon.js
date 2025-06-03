import Rcon from 'rcon';
import { instance } from '../instance.js';



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

async function sendCommands(commands) {
    const server = instance.config();
    return new Promise((resolve, reject) => {
        try {
        const connection = new Rcon(server.ip, server.port, server.rconPassword);
        connection.on('auth', () => {
            for (const command of commands) {
                connection.send(command)
            }
            connection.disconnect()
        }).on('error', (err) => {
            console.log("error " + err);
            connection.disconnect()
            reject(err)
            
        }).on("response", (res) => {
            connection.disconnect()
            resolve(res)
        })
        connection.connect()
        } catch (error) {
        console.error("Rcon connection error: " + error)
        reject(error)
        }
    })
}

async function checkServer() {
    const server = instance.config();
    return new Promise((resolve, reject) => {
        try {
            const connection = new Rcon(server.ip, server.port, server.rconPassword);

            connection.on('auth', () => {
                connection.send("status")
                connection.disconnect()
            }).on('error', (err) => {
                instance.log("RCON: "+ err)
                connection.disconnect()
                resolve(false)
            }).on("response", (res) => {
                connection.disconnect()
                resolve(res)
            });

            connection.connect();
        } catch (error) {
            instance.log("RCON: "+error)
            resolve(false);
        }
    })
}

async function sendSayCommands(texts) {
    const editedText = []
    for (const text of texts){
        editedText.push(replaceColour("say " + text))
    }
    sendCommands(editedText)
}

function replaceColour(text){
    let tempText = text
    for (const colour of colors){
        tempText = tempText.replaceAll(("{"+colour.name+"}"), colour.code)
    }
    return tempText
}

export const rcon =
{
    command: sendCommands,
    say: (text) => setImmediate(()=>{return sendSayCommands(text)}),
    status: checkServer
}