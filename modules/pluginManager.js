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

async function loadPlugin (server, pluginClass) {
    const plugin = new pluginClass(server)
    if (pluginClass.router) {
        server.router.use(`/plugins/${pluginClass.name}`, pluginClass.router);
    }
    server.plugins.push({"name": pluginClass.name, "commands": pluginClass.commands, "description": pluginClass.description, "author": pluginClass.author})
    server.command.list.push(...pluginClass.commands)
}

export {loadPlugins, loadPlugin}