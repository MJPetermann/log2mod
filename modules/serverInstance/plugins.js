import { readdirSync } from 'node:fs';
import { join } from 'node:path';

const pluginFiles = readdirSync("./plugins").filter(file => file.endsWith('.mjs'));

async function loadPlugins(server) {
    server.plugins = []
    for (const file of pluginFiles) {
        const plugin = (await import("../plugins/" + file)).default
        if (server.config.plugins && !(server.config.plugins.includes(plugin.name))) continue
        loadPlugin(server, plugin)
    }
}

function loadPlugin(server, plugin) {
    
}



this.server.on((event, data) => {
    if ("#event_" + event in this) {
        this["#event_" + event](data);
        return
    }
    this.server.log(`Event ${event} not handled in ${this.constructor.name}`, "warn")
});

this.server.command.on((command, args) => {
    if ("#command_" + command in this) {
        this["#command_" + command](args);
        return
    }
    this.server.log(`Command ${command} not handled in ${this.constructor.name}`, "warn")
});

this.server.http.on((method, name, data) => {
    if ("#http_" + method + name in this) {
        this["#http_" + method + name](data);
        return
    }
    this.server.log(`HTTP ${method} ${name} not handled in ${this.constructor.name}`, "warn")
})


// probs to https://stackoverflow.com/questions/31054910/get-functions-methods-of-a-class
const getAllMethods = (obj) => {
    let props = []

    do {
        const l = Object.getOwnPropertyNames(obj)
            .concat(Object.getOwnPropertySymbols(obj).map(s => s.toString()))
            .sort()
            .filter((p, i, arr) =>
                typeof obj[p] === 'function' &&  //only the methods
                p !== 'constructor' &&           //not the constructor
                (i == 0 || p !== arr[i - 1]) &&  //not overriding in this prototype
                props.indexOf(p) === -1          //not overridden in a child
            )
        props = props.concat(l)
    }
    while (
        (obj = Object.getPrototypeOf(obj)) &&   //walk-up the prototype chain
        Object.getPrototypeOf(obj)              //not the the Object prototype methods (hasOwnProperty, etc...)
    )

    return props
}