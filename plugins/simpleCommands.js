export default class simpleCommands {
    static name = "simpleCommands"
    static description = "Test the rcon connection."
    static author = "MJPetermann"
    static commands = [
        { command: "rcon", permission: "admin.rcon", description: "allows for the execution of rcon with the text chat" },
        { command: "list", permission: "basic.list", description: "lists all players on the server with player name" },
        { command: "help", permission: "basic.help", description: "lists all commands on the server and provides info" }]
    static init(server) {

        server.on("ready", ()=> server.sayRcon(["{pink}simpleCommands: {gold}Type '!help' for commands."]))

        server.command.on("rcon", async (data) => {
            if (!data.arguments[0]) return server.sayRcon(["{light red}This command requires 1 or more arguments!"])
            server.sayRcon([
                "---------- rcon output ----------",
                ...(await server.Rcon([data.arguments.join(" ")])).split('\n')
            ])
        })

        server.command.on("list", () => {
            const messages = []
            messages.push("--- playerlist ---")
            for (const player of server.players) {
                messages.push(player.name)
            }
            messages.push("--- playerlist ---")
            server.sayRcon(messages)
        })

        server.command.on("help", async (data) => {
            const commands = []
            commands.push("--- commands ---")
            for (const command of server.command.list) {
                if(!await server.permissions.playerHasPermission(command, data.player)) continue
                commands.push(command.command)
            }
            commands.push("--- commands ---")
            server.sayRcon(commands)
        })
    }
}