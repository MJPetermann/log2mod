class Player{
    constructor(playerData){
        this.name = playerData.name
        this.id = playerData.playerId
        this.steamId3 = playerData.steamId3
        this.side = playerData.side || undefined
    }
}

export async function initPlayerlist(server){
    server.players = []

    server.command.on("reg", (data)=>{
        if(server.players.filter(testplayer=>testplayer.steamId3 == data.player.steamId3)[0]) return server.sayRcon(["You're already registered"])
        server.players.push(new Player(data.player))
    })

    server.on("playerSwitch", (data)=>{
        // if(data.player.steamId3 == "BOT") return
        const player = server.players.filter(testplayer=>testplayer.steamId3 == data.player.steamId3)[0]
        console.log(player)
        if(player) return player.side = data.player.side
        server.players.push(new Player(data.player))
    })

    server.on("playerDisconnect", (data)=>{
        // if(data.player.steamId3 == "BOT") return
        const playerIndex = server.players.findIndex(testplayer=>testplayer.steamId3 == data.player.steamId3)
        if(!playerIndex) return
        server.players.splice(playerIndex)
        console.log(server.players)
    })


    server.command.on("list", ()=>{
        const messages = []
        messages.push("LIST START")
        for (const player of server.players){
            messages.push(player.name)
        }
        messages.push("LIST STOP")
        server.sayRcon(messages)
    })
}