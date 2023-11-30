export default class rconCommand {
    static name = "rconCommand"
    static description = "Test the rcon connection."
    static author = "MJPetermann"
    static commands = ["rcon"]
    static init(server) {
        server.command.on("rcon", async (commandArguments)=>{
            if(!commandArguments[0]) return server.sayRcon(["This command requires 1 or more arguments!"])
            server.sayRcon([
                "---------- rcon output ----------",
                ...(await server.Rcon([commandArguments.join(" ")])).split('\n')
            ])
        })
    }
}