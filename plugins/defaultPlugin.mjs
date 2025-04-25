export default class defaultPlugin {
    static name = "defaultPlugin"
    static description = "This Plugin is a default plugin for the server. It contains some basic commands and features."
    static version = "1.0.0"
    static author = "MJPetermann"
    static commands = [
        { command: "ping", permission: "admin.rcon", description: "Pong!" }]
    static http = [
        { method: "GET", name: "default", path: "/defaultPlugin", description: "This is a default plugin for the server. It contains some basic commands and features." },
        { method: "POST", name: "default", path: "/defaultPlugin", description: "This is a default plugin for the server. It contains some basic commands and features." }]
    

    constructor(server) {
        this.server = server;
        this.server.log(`Plugin ${this.constructor.name} version ${this.constructor.version} loaded`, "info")
        this.ping = "ping"
    }

    command_ping = (args) => {
        this.server.message(`Pong!`)
    }
}