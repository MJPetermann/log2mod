import event from "events"
import { loadRcon } from "./features/rcon.js"
import { loadPlugins } from "./pluginManager.js"
import { initCommands } from "./features/commandManager.js"

const serverManagers = []
class ServerManager extends event.EventEmitter{
    constructor(data){
        super()
        this.name = data.name
        this.ip = data.ip
        this.port = data.port || 27015
        this.rconPassword = data.rconPassword || ""
        this.config = data.config || {}
    }
    async init(){
        await loadRcon(this)
        await this.loadPublicIp()
        await initCommands(this)
        await loadPlugins(this)

    }
    async loadPublicIp () {
        const publicIpRegex = /udp\/ip\s*:\s*\d+\.\d+\.\d+\.\d+:\d+\s*\(public\s+(\d+\.\d+\.\d+\.\d+):\d+\)/
        const checked = await this.statusRcon()
        if(!checked) {
            this.active = false
            console.log("SERVER: " + this.name + " is not reachable")
            return
        }
        this.publicIp = checked.match(publicIpRegex)[1]
    }
} 

async function loadServer(server){
    serverManagers.push(new ServerManager(server))
    await serverManagers[(serverManagers.length)-1].init()
}

async function initServerlist (serverlist) {
    for (const server of serverlist){
        if (server.active == false) return
        await loadServer(server)
    }
}

export {serverManagers, initServerlist}