import { registerListener, emitEvent } from "../event.js"
import { instance } from "../instance.js"
class Player {
    constructor(steamid, permissions) {
        this.steamid = steamid
        this.name 
        this.playerid 
        this.ip
        this.side
        this.active
        this.permissions = permissions || []
    }
}

export const players = []

export function initPlayerList() {
// check and add or mark active Player when 
// playerConnected      - id, steamid, name, ip
// playerEntered        - id, steamid, name
// playerPickedUp       - id, steamid, name, side
// playerSay            - id, steamid, name, side
// playerCommand        - id, steamid, name, side
// playerSwitch         - id, steamid, name, side

// mark player as disconnected
// playerDisconnected   - id, steamid, name, side

    addPlayerPermissions();
    // registerListener("playerConnected", handleActivePlayerEvent);
    // registerListener("playerEntered", handleActivePlayerEvent);
    // registerListener("playerPickedUp", (data) => handleActivePlayerEvent(data.player));
    // registerListener("playerSay", (data) => handleActivePlayerEvent(data.player));
    // registerListener("playerCommand", (data) => handleActivePlayerEvent(data.player));
    // registerListener("playerSwitch", (data) => handleActivePlayerEvent(data.player));
    registerListener("playerDisconnected", (playerData) => {
        const player = players.find(p => p.steamid === playerData.steamid);
        if (player) {
            player.active = false;
            emitEvent("playerChanged", {player: player, action: "disconnected"});
            instance.log(`Player disconnected: ${player.name} (${player.steamid})`);
        }
    });
}

export function handleActivePlayerEvent(playerData) {
    let player = players.find(p => p.steamid === playerData.steamid);
    if (player && !checkForChange(player, playerData)) return player;
    let action = (player && player.active)? "updated" : "added";
    if (!player) {
        player = new Player(playerData.steamid);
        player.active = true;
        players.push(player);
        action = "added"
        checkForChange(player, playerData)
    }
    player.active = true;
    emitEvent("playerChanged", {player: player, action: action});
    instance.log(`Player ${action}: ${player.name} (${player.steamid})`);
    return player;
}

function checkForChange(player, data) {
    let changed = false;
    for (const key in data) {
        if (data[key] !== player[key]) {
            player[key] = data[key];
            changed = true;
        }
    }
    return changed;
}

function addPlayerPermissions() {
    let defaultPermissions = []

    for (const group in instance.config().config.permissionGroups){
        if (group == "default") {
            defaultPermissions = instance.config().config.permissionGroups[group].permissions
            continue
        }
        for (const player of instance.config().config.permissionGroups[group].players) {
            let tempPlayer = players.find(p => p.steamid === player)
            if (tempPlayer) tempPlayer.permissions.push(...instance.config().config.permissionGroups[group].permissions)
            else {
                players.push(new Player(player, [...instance.config().config.permissionGroups[group].permissions, ...defaultPermissions]))
            }
        }
            
    }
}

