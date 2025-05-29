import { registerListener } from "./event.js";
import { instance } from "./instance.js";
import { rcon } from "./features/rcon.js";
import { onCommand, offCommand } from "./features/commands.js";
import { players } from "./features/players.js";
import { addRoute } from "./http.js";
import { hasPermission } from "./features/commands.js";

export default class ServerPluginInterface {
  constructor(plugin) {
    this.events = {}
    this.plugin = plugin
    this.interface = {
      on: this.#on,
      off: this.#off,
      rcon: this.#rcon,
      message: this.#message,
      log: this.#log,
      player: {
        list: this.#playerList,
        get: this.#playerGet,
        hasPermission: this.#playerHasPermission
      },
      command: {
        on: this.#commandOn,
        off: this.#commandOff,
      },
      http: {
        get: this.#httpGet,
        post: this.#httpPost,
      }
    }
  }

  #on = (event, callback, id) => {
    if (this.events[event] == { callback: callback, id: id }) this.#log(`Event ${event} already registered with id ${id}`)
    if (this.events[event] === undefined) {
        this.events[event] = []
        registerListener(event, (data) => {
            for (const listener of this.events[event]) {
                listener.callback(data)
            }
        })
    }
    this.events[event].push({ callback: callback, id: id })
  }
  
  #off = (event, id) => {
    if (this.events[event] === undefined) return this.#log(`Event ${event} not registered`)
    this.events[event] = this.events[event].filter(listener => listener.id !== id)
  }

  #message = (message) => {
    if (!Array.isArray(message)) {
      message = [message]
    }
    rcon.say(message)
  }

  #rcon = async (command, callback) => {
    if (!Array.isArray(command)) {
      command = [command]
    }
    if (!callback) {
      return rcon.command(command)
    }
    callback(await rcon.command())
  }

  #log = (message) => {
    instance.log(this.plugin.name + " - " + message)
  }
  #playerList = () => {
    return players.filter(player => player.active)
  }
  #playerGet = (steamid) => {
    return players.find(player => player.steamid === steamid) || null
  }
  #playerHasPermission = (player, permission) => {
    return hasPermission(permission, player.permissions)
  }
  #httpGet = (url, callback) => {
    addRoute(this.plugin.name+"/"+url, "get", (req, res) => {
      if (callback) {
        callback(req, res);
      } else {
        res({ status: 200, body: "OK" });
      }
    });
  }
  #httpPost = (url, data, callback) => {
    addRoute(this.plugin.name+"/"+url, "post", (req, res) => {
      if (callback) {
        callback(req, res);
      } else {
        res({ status: 200, body: "OK" });
      }
    });

  }
  #commandOn = (command, callback) => {
    onCommand(command, callback)
  }
  #commandOff = (command, callback) => {
    offCommand(command, callback)
  }
  
}