class Player {
    constructor(playerData, server) {
        this.name = playerData.name
        this.id = playerData.playerId
        this.steamId3 = playerData.steamId3
        this.side = playerData.side || undefined
        this.permissions = []
    }
}

export async function initPlayerlist(server) {
    server.players = []

    if(server.config.autoloadPlayerlist) server.Rcon(["mp_restartgame 1"])

    server.on("playerSwitch", (data) => {
        const player = server.players.filter(testplayer => testplayer.steamId3 == data.player.steamId3)[0]
        if (player) return player.side = data.player.side
        addPlayer(server, data.player)
    })

    server.on("playerSay", (data) => {
        const player = server.players.filter(testplayer => testplayer.steamId3 == data.player.steamId3)[0]
        if (player) return player.side = data.player.side
        addPlayer(server, data.player)
    })

    server.on("playerDisconnect", (data) => {
        removePlayer(server, data.player)
    })

    server.on("playerPickedUp", (data) => {
        const player = server.players.filter(testplayer => testplayer.steamId3 == data.player.steamId3)[0]
        if (player) return player.side = data.player.side
        addPlayer(server, data.player)
    })
}

async function addPlayer(server, player) {
    server.log("Added " + player.name +" [" + player.steamId3 +"] to list")
    const newPlayer = new Player(player, server)
    newPlayer.permissions.push(...(await getPlayersPermissions(player, server)))
    server.players.push(newPlayer)

}

async function removePlayer(server, player) {
    server.log("Removed " + player.name + " to list")
    const playerIndex = server.players.findIndex(testplayer => testplayer.steamId3 == player.steamId3)
    if (playerIndex == -1) return
    server.players.splice(playerIndex)
}

async function getPlayersPermissions(player, server){
    if(!server.config.permissions) return ["*"]
    const permissions = []
    for (const group in server.config.permissions){
        if(server.config.permissions[group].players?.includes(player.steamId3)) permissions.push(...server.config.permissions[group]?.permissions)
    }
    return permissions
}