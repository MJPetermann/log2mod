import { readdirSync } from 'node:fs';

const pluginFiles = readdirSync("./plugins").filter(file => file.endsWith('.js'));

async function loadPlugins(server){
    for (const file of pluginFiles) {
        const plugin = (await import("../plugins/" + file)).default
        if (!server.plugins || (server.plugins.includes(plugin.name))) continue
        loadPlugin(server, plugin)
    }
}

async function loadPlugin (server, plugin) {
    await plugin.init(server)
    server.pluginlist.push({"name": plugin.name, "commands": plugin.commands, "description": plugin.description, "author": plugin.author})
    server.commands.push(plugin.commands)
}

export {loadPlugins, loadPlugin}