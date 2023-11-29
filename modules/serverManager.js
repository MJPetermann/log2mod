import event from "events"
import { checkServer } from "./rcon.js"

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
        const publicIpRegex = /udp\/ip\s*:\s*\d+\.\d+\.\d+\.\d+:\d+\s*\(public\s+(\d+\.\d+\.\d+\.\d+):\d+\)/
        this.publicIp = (await checkServer(this)).match(publicIpRegex)[1]
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