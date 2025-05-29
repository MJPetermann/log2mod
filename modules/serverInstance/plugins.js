import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import ServerPluginInterface from './serverPluginInterface.js';
import { instance } from './instance.js';
import { addCommand } from './features/commands.js';
import { addRoute } from './http.js';

let plugins = []

const pluginFiles = readdirSync("./plugins").filter(file => file.endsWith('.mjs'));

export async function loadPlugins() {
    const server = instance.config();
    console.log("Loading plugins...");
    for (const file of pluginFiles) {
        const plugin = (await import("../../plugins/" + file)).default
        if (server.config.plugins && !(server.config.plugins.includes(plugin.name))) continue
        loadPlugin(server, plugin)
    }
    addRoute("/plugins", "get", (req, res) => {
        const pluginList = plugins.map(plugin => ({
            name: plugin.name,
            description: plugin.description,
            version: plugin.version
        }));
        res({status: 200, body: JSON.stringify(pluginList)});
    })
}

export function loadPlugin(server, plugin) {
    for (const command of plugin.commands || []) {
        if (command.command && command.permission) {
            addCommand(command)
        } else {
            instance.log(`Plugin ${plugin.name} has an invalid command: ${JSON.stringify(command)}`);
        }
    }

    const spi = new ServerPluginInterface(plugin);
    const pluginClass = new plugin(spi)
    plugins.push(plugin);
}
