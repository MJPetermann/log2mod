import event from "events"
import express from 'express';

import { loadRcon } from "./features/rcon.js"
import { loadPlugins } from "./pluginManager.js"
import { initCommands } from "./features/commandManager.js"
import { initPlayerlist } from "./features/playerlist.js"
import { initPermission } from "./features/permissionManager.js"

import log2modConfig from "../cfg/log2mod.json" assert {type: 'json'}

const serverManagers = []
class ServerManager extends event.EventEmitter{
    constructor(data){
        super()
        this.name = data.name
        this.ip = data.ip
        this.port = data.port || 27015
        this.rconPassword = data.rconPassword || ""
        this.config = data.config || {}
        this.router = express.Router();
    }

    async init(){
        if (this.config?.active != undefined && !this.config.active) return
        await loadRcon(this)
        if(!(await this.loadPublicIp())) return
        await initPermission(this)
        await initCommands(this)
        initPlayerlist(this)
        await loadPlugins(this)
        
        this.sayRcon(["{green}Log2Mod initiated!{green}"])
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

        this.Rcon(["log on","mp_logdetail 3","mp_logmoney 1","mp_logdetail_items 1","logaddress_add_http \"http://"+log2modConfig.ip+":"+log2modConfig.port+"\""])

        this.publicIp = checked.match(publicIpRegex)[1]
        return true
    }
} 

async function loadServer(server, app){
    const serverManager = new ServerManager(server) 
    serverManagers.push(serverManager)
    app.use("/servers/"+server.name, serverManager.router)
    await serverManager.init()
}

async function initServerlist (serverlist, app) {
    for (const server of serverlist){
        if (server.active == false) return
        await loadServer(server, app)
    }
}

export {serverManagers, initServerlist}