import event from "events"

class CommandManager extends event.EventEmitter{
    constructor(){
        super()
        this.list = []
    }
}
export async function initCommands(server) {
    server.command = new CommandManager()
    server.on("playerCommand",(data) => server.command.emit(data.command, data.arguments, data.player))
}