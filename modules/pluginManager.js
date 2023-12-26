import { readdirSync } from 'node:fs';
import express from 'express';


const pluginFiles = readdirSync("./plugins").filter(file => file.endsWith('.mjs'));

async function loadPlugins(server){
    server.plugins = []
    for (const file of pluginFiles) {
        const plugin = (await import("../plugins/" + file)).default
        if (server.config.plugins && !(server.config.plugins.includes(plugin.name))) continue
        loadPlugin(server, plugin)
    }

    server.router.get('/plugins', (req, res) => {
        res.json(server.plugins.map(plugin => plugin.name))
    })
}

async function loadPlugin (server, pluginClass) {
    const plugin = new pluginClass(server, express.Router())
    if (plugin.router) {
        server.router.use("/plugins/"+plugin.name, plugin.router);
    }
    server.plugins.push(plugin)
    server.command.list.push(...pluginClass.commands)
}

export {loadPlugins, loadPlugin}