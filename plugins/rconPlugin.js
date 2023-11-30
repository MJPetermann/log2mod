export default class rconCommand {
    static name = "rconCommand"
    static description = "Test the rcon connection."
    static author = "MJPetermann"
    static commands = ["rcon"]
    static init(server) {
        server.on("playerCommand", async (data)=>{
            if(data.command != "rcon") return
            if(!data.arguments[0]) return server.sayRcon(["say This command requires 1 or more arguments!"])
            server.sayRcon([
                "---------- rcon output ----------",
                ...(await server.Rcon([data.arguments.join(" ")])).split('\n')
            ])
        })
    }
}