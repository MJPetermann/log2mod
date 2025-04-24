export default class defaultPlugin {
    static name = "defaultPlugin"
    static description = "This Plugin is a default plugin for the server. It contains some basic commands and features."
    static version = "1.0.0"
    static author = "MJPetermann"
    static commands = [
        { command: "rcon", permission: "admin.rcon", description: "allows for the execution of rcon with the text chat" },
        { command: "list", permission: "basic.list", description: "lists all players on the server with player name" },
        { command: "help", permission: "basic.help", description: "lists all commands on the server and provides info" },
        { command: "color", permission: "admin.color", description: "lists all commands on the server and provides info" }]

    constructor(server, plugin) {
        this.server = server;
    }

    init() {
        this.server.command.on((command, args) => this["#handle_"+ command](args));
    }

    #command_rcon = (args) => {
        this.server.rcon(message, (response) => {
            this.server.message(response, message.sender);
        });
    }

    #command_list = (args) => {
        this.server.playerlist.get((players) => {
            let playerList = players.map(player => player.name).join(", ");
            this.server.message(`Players on the server: ${playerList}`, message.sender);
        });
    }

    #command_help = (args) => {
        let helpMessage = "Available commands:\n";
        this.server.commands.forEach(command => {
            helpMessage += `/${command.command} - ${command.description}\n`;
        });
        this.server.message(helpMessage, message.sender);
    }

    #command_color = (args) => {
        this.server.message("Available colors: red, green, blue, yellow, purple, orange", message.sender);
    }
}