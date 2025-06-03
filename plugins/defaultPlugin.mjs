import { totalCommands } from "../modules/serverInstance/features/commands.js"
import { colors } from "../modules/serverInstance/features/rcon.js"
export default class defaultPlugin {
    static name = "defaultPlugin"
    static description = "This Plugin is a default plugin for the server. It contains some basic commands and features."
    static version = "1.0.0"
    static author = "MJPetermann"
    static commands = [
        { command: "ping", permission: "admin.ping", description: "Pong!" },
        { command: "list", permission: "admin.list", description: "Shows a list of all players." },
        { command: "help", permission: "basic.help", description: "Shows a list of all commands." },
        { command: "rcon", permission: "admin.rcon", description: "Executes a rcon command." },
        { command: "colors", permission: "admin.colors", description: "Shows a list of all available colors." }
    ]
    constructor(ServerPluginInterface) {
        this.spInterface = ServerPluginInterface.interface
        this.spInterface.log(`Plugin ${this.constructor.name} version ${this.constructor.version} loaded`)
        this.init();
    }

    init() {
        this.spInterface.command.on("ping", this.command_ping);

        this.spInterface.command.on("list", this.command_list);
        
        this.spInterface.command.on("help", this.command_help);

        this.spInterface.command.on("rcon", this.command_rcon);

        this.spInterface.command.on("colors", this.command_colors);

        this.spInterface.http.get("/", (req, res) => {
            res({ status: 200, body: "Hello from the default plugin!" });
        });
    }

    command_ping = (player, args) => {
        this.spInterface.message(`Pong!`)
    }

    command_list = (player, args) => {
        this.spInterface.message([
            "{green}--- playerlist ---",
            ...(this.spInterface.player.list()).map(player => `{orange}• ${player.name}`)])
    }

    command_help = (player, args) => {
        if (args.length > 0) {
            const command = totalCommands[args[0]];
            if (command) {
                this.spInterface.message([
                    `{orange}${command.command}: {grey}${command.description}`]);
            } else {
                this.spInterface.message(`{red}Command not found: ${args[0]}`);
            }
            return;
        }
        let message = [];
        for (const command of Object.keys(totalCommands)) {
            const cmd = totalCommands[command];
            if (!this.spInterface.player.hasPermission(player, cmd.permission)) continue;
            message.push(`{orange}${cmd.command}`);
            message.push(`- {grey}${cmd.description}`);
        }
        if (message.length === 0) {
            this.spInterface.message(`{red}No commands available.`);
            return;
        }
        this.spInterface.message([
            "{green}--- Commands ---",
            ...message
        ]);
    }

    command_rcon = async (player, args) => {
        if (args.length === 0) {
            this.spInterface.message(`{red}Please provide a rcon command.`);
            return;
        }
        const command = args.join(" ");
        try {
            const response = await this.spInterface.rcon(command);
            this.spInterface.message([`{green}RCON Command executed successfully:`, ...response.split("\n").map(line => `{grey}${line}`)]);
        } catch (error) {
            this.spInterface.message(`{red}Error executing RCON command: ${error.message}`);
        }
    }

    command_colors = (player, args) => {
        this.spInterface.message(["{orange}Available colors: ", ...colors.map(color => `{${color.name}}${color.name}`)]);
    }
}