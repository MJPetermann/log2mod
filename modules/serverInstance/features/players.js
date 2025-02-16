const players = []

function getPlayer(playerData) {
    let playerIndex = players.findIndex(player => player.steamid === playerData.steamid)
    if (playerIndex === -1) addPlayer(playerData)
    if (players[playerIndex] !== playerData) players[playerIndex] = playerData
    return players[playerIndex]
}

function addPlayer(player) {
    players.push(player)
    return player
}

export { players, getPlayer }