async function playerHasPermission(server, command, player) {
    if(!server.config.permissions) return true
    if (server.config.permissions.default && await permissionsForCommand(command.permission, server.config.permissions.default.permissions)) return true
    if(!player) return false
    return await permissionsForCommand(command.permission, player.permissions)
}

async function permissionsForCommand(basePermission, checkedPermissions){
    const splitCommandPermission = basePermission.split(".")

    for (const testPermission of checkedPermissions) {
        if(testPermission == basePermission) return true

        let splitTestPermission = testPermission.split(".")

        for (let i = 0; i < splitTestPermission.length; i++) {
            if (!splitCommandPermission[i]) return true
            if (splitTestPermission[i] == "*") return true
            if (splitCommandPermission[i] != splitTestPermission[i]) break
        }

    }
    return false
}

export async function initPermission(server) {
    server.permissions = {}
    server.permissions.playerHasPermission = (command, player) => {
        return playerHasPermission(server, command, player)
    }
    server.permissions.permissionsForCommand = (basePermission, checkedPermissions) => {
        return permissionsForCommand(basePermission, checkedPermissions)
    }
}