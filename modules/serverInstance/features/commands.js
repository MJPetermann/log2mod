import { rcon } from "./rcon.js";
import { instance } from "../instance.js";

export const totalCommands = {}
const activeCommands = {}

// const commmand = { 
//     command: "ping", 
//     permission: "admin.rcon", 
//     description: "Pong!",
//     active: false 
// }

export function addCommand(command) {
    if (totalCommands[command.name]) {
        instance.log(`Command ${command.command} already exists.`);
        return;
    }
    totalCommands[command.command] = command;
}

export function onCommand(command, callback) {
    if (!totalCommands[command]) {
        instance.log(`Command ${command} does not exist.`);
        return;
    }
    if (activeCommands[command]) {
        instance.log(`Command ${command} is already active.`);
        return;
    }
    activeCommands[command] = callback;
    totalCommands[command].active = true;
}

export function offCommand(command) {
    if (!totalCommands[command]) {
        instance.log(`Command ${command} does not exist.`);
        return;
    }
    if (!activeCommands[command]) {
        instance.log(`Command ${command} is not active.`);
        return;
    }
    delete activeCommands[command];
    totalCommands[command].active = false;
}

export function hasPermission(commandPermission, playerPermissions){
    const splitCommandPermission = commandPermission.split(".")

    for (const testPermission of playerPermissions) {
        if(testPermission == commandPermission) return true

        let splitTestPermission = testPermission.split(".")

        for (let i = 0; i < splitTestPermission.length; i++) {
            if (!splitCommandPermission[i]) return true
            if (splitTestPermission[i] == "*") return true
            if (splitCommandPermission[i] != splitTestPermission[i]) break
        }

    }
    return false
}

export function handleCommand(command) {
    command.command = command.command.toLowerCase();
    if (!totalCommands[command.command]) {
        return;
    }
    if (!activeCommands[command.command]) {
        rcon.say([`{red}Command{purple} ${command.command} {red}is not active.`]);
        return;
    }
    if (!hasPermission(totalCommands[command.command].permission, command.player.permissions)) {
        rcon.say([`{red}You do not have permission to use this command.`]);
        return;
    }

    return activeCommands[command.command](command.player, command.arguments);
}
