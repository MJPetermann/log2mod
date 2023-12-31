import event from "events"

class CommandManager extends event.EventEmitter {
    constructor() {
        super()
        this.list = []
    }
}

export async function initCommands(server) {
    server.command = new CommandManager()
    server.command.setMaxListeners(1)
    server.router.get('/commands', (req, res) => {
        const commands = server.command.list.map(command => command.command)
        res.json(commands)
    })
    server.on("playerCommand", async (data) => {
        const command = (server.command.list.filter((command) => command.command == data.command)[0])
        if (!command) return
        if (command.active != undefined && !command.active) return
        if (!(await server.permissions.playerHasPermission(command, data.player))) return server.sayRcon(["{red}You don't have the permission for this command!"])
        server.command.emit(data.command, data)
    })
}