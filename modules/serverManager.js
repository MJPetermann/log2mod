import event from "events"
import { loadRcon } from "./features/rcon.js"
import { loadPlugins } from "./pluginManager.js"
import { initCommands } from "./features/commandManager.js"
import { initPlayerlist } from "./features/playerlist.js"
import { initPermission } from "./features/permissionManager.js"

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
        if(!(await this.loadPublicIp())) return
        await initPermission(this)
        await initCommands(this)
        await initPlayerlist(this)
        await loadPlugins(this)
        
        this.sayRcon(["{gold}Log2Mod initiated!"])
        this.log(`Initiated (${this.plugins.length} plugin(s) with ${this.command.list.length} command(s))`)

        this.emit("ready")

    }
    log(logText){
        console.log(this.name+"@"+this.ip+":"+ this.port + " : " + logText)
    }
    async loadPublicIp () {
        const publicIpRegex = /udp\/ip\s*:\s*\d+\.\d+\.\d+\.\d+:\d+\s*\(public\s+(\d+\.\d+\.\d+\.\d+):\d+\)/
        const checked = await this.statusRcon()
        if(!checked) {
            this.active = false
            this.log("Server is not reachable")
            return false
        }
        this.publicIp = checked.match(publicIpRegex)[1]
        return true
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