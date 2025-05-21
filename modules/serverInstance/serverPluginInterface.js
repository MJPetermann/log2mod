import { registerListener } from "./event";

export default class ServerPluginInterface {
  constructor(server, plugin) {
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
        reload: this.#playerReload,
        get: this.#playerGet
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
  
  #on = (event, callback, id) => {
    if (this.events[event] == { callback: callback, id: id }) server.log(`Event ${event} already registered with id ${id}`, "warn")
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
  
  #off = ("event", id) => {
    if (this.events[event] === undefined) return server.log(`Event ${event} not registered`, "warn")
    this.events[event] = this.events[event].filter(listener => listener.id !== id)
  }

  rcon(command, callback) {
    server.rcon(command, callback)
  }

  // add command.on and command.off
  command(command, callback) {
    server.command.add(command, callback)
  }

}