class Player {
    constructor(playerData, server) {
        this.name = playerData.name
        this.id = playerData.playerId
        this.steamId3 = playerData.steamId3
        this.side = playerData.side || undefined
        this.permissions = []
    }
}

export function initPlayerlist(server) {
    server.player = {}
    server.player.list = []

    if(server.config.autoloadPlayerlist) server.Rcon(["mp_restartgame 1"])

    server.player.get = (server, player) => {
        return getPlayer(server, player)
    }

    server.player.getBySteamId3 = (server, steamId3) => {
        return getPlayerBySteamId3(server, steamId3)
    }

    server.on("playerDisconnect", async (data) => {
        removePlayer(server, data.player)
    })
}

function getPlayer(server, player) {
    const foundplayer = server.player.list.filter(player => player.steamId3 == player.steamId3)[0]
    if (!foundplayer) return addPlayer(server, player)
    if (player.side) foundplayer.side = player.side
    return foundplayer
    
}

function getPlayerBySteamId3(server, steamId3) {
    const foundplayer = server.player.list.filter(player => player.steamId3 == steamId3)[0]
    if (!foundplayer) return
    return foundplayer
}

function addPlayer(server, player) {
    server.log("Added " + player.name +" [" + player.steamId3 +"] to list")
    const newPlayer = new Player(player, server)
    newPlayer.permissions.push(...(getPlayersPermissions(player, server)))
    server.player.list.push(newPlayer)
    server.emit("playerAdded", newPlayer)
    return newPlayer
}

function removePlayer(server, player) {
    const playerIndex = server.player.list.findIndex(testplayer => testplayer.steamId3 == player.steamId3)
    if (playerIndex == -1) return
    server.log("Removed " + player.name + " to list")
    server.player.list.splice(playerIndex)
    server.emit("playerRemoved")
}

function getPlayersPermissions(player, server){
    if(!server.config.permissions) return ["*"]
    const permissions = []
    for (const group in server.config.permissions){
        if(server.config.permissions[group].players?.includes(player.steamId3)) permissions.push(...server.config.permissions[group]?.permissions)
    }
    return permissions
}