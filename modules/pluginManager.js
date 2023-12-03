import { readdirSync } from 'node:fs';

const pluginFiles = readdirSync("./plugins").filter(file => file.endsWith('.mjs'));

async function loadPlugins(server){
    server.plugins = []
    for (const file of pluginFiles) {
        const plugin = (await import("../plugins/" + file)).default
        if (server.config.plugins && !(server.config.plugins.includes(plugin.name))) continue
        loadPlugin(server, plugin)
    }
}

async function loadPlugin (server, plugin) {
    await plugin.init(server)
    server.plugins.push({"name": plugin.name, "commands": plugin.commands, "description": plugin.description, "author": plugin.author})
    server.command.list.push(...plugin.commands)
}

export {loadPlugins, loadPlugin}