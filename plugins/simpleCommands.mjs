import { colors } from "../modules/features/rcon.js"
export default class simpleCommands {

    static name = "simpleCommands"
    static description = "Test the rcon connection."
    static author = "MJPetermann"
    static commands = [
        { command: "rcon", permission: "admin.rcon", description: "allows for the execution of rcon with the text chat" },
        { command: "list", permission: "basic.list", description: "lists all players on the server with player name" },
        { command: "help", permission: "basic.help", description: "lists all commands on the server and provides info" },
        { command: "color", permission: "admin.color", description: "lists all commands on the server and provides info" }]

    constructor(server, router) {
        this.name = this.constructor.name
        this.description = this.constructor.description
        this.author = this.constructor.author
        this.commands = this.constructor.commands
        
        this.router = router

        this.server = server;
        this.init(this.server);
        this.config = {}
    }
    init(server) {
        server.on("matchEnd", (data) => server.sayRcon(["{lightGreen}simpleCommands {white} Game has ended. Score {purple}" + data.score.ct + ":" + data.score.t + "{white} on map {purple}" + data.map + "{white} after {purple}" + data.duration + "{white} min."]))

        server.on("ready", ()=> server.sayRcon(["{lightGreen}simpleCommands {white}Type {purple}'!help'{white} for commands.{white}"]))

        server.command.on("rcon", async (data) => {
            if (!data.arguments[0]) return server.sayRcon(["{lightGreen}simpleCommands {red}This command requires 1 or more arguments!"])
            server.sayRcon([
                "---------- rcon output ----------",
                ...(await server.Rcon([data.arguments.join(" ")])).split('\n')
            ])
        })

        server.command.on("list", () => {
            const messages = []
            messages.push("--- playerlist ---")
            for (const player of server.player.list) {
                messages.push(player.name)
            }
            messages.push("--- playerlist ---")
            server.sayRcon(messages)
        })

        server.command.on("help", async (data) => {
            if (data.arguments[0]) {
                const command = server.command.list.filter(command => command.command == data.arguments[0])[0]
                if (!command) return server.sayRcon(["{lightGreen}simpleCommands {red}This command does not exist!"])
                server.sayRcon([
                    "{green}--- command ---",
                    "{purple}⠀⠀ " + command.command,
                    "{white}⠀⠀ " + command.description,
                    "{green}--- command ---",
                ])
                return
            }
            const commands = []
            commands.push("{green}--- commands ---")
            for (const command of server.command.list) {
                if(!await server.permissions.playerHasPermission(command, data.player)) continue
                commands.push("⠀⠀ {purple}" + command.command)
            }
            commands.push("{green}--- commands ---")
            server.sayRcon(commands)
        })

        server.command.on("color", async (data) => {
            const commands = []
            commands.push("--- colors ---")
            for (const colour of colors) {
                commands.push("⠀⠀ " + colour.code + colour.name)
            }

            commands.push("--- colors ---")
            server.sayRcon(commands)
        })
    }
}