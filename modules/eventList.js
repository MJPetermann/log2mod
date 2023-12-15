const events = [
    {
        name: "playerSay",
        regex: /"(.+)<(\d+)><\[([\[\]\w:]+)\]><(TERRORIST|CT)>" say(_team)? "(.*)"/,
        data: ["", "name", "playerId", "steamId3", "side", "chatType", "text"],
        format: function (match, server) {
            const playerdata = {
                name: match[1],
                playerId: match[2],
                steamId3:  match[3],
                side: match[4]
            }
            return {
                player: server.player.get(server, playerdata),
                isTeamChat: (match[5] == "_team"),
                text: match[6]
            }
        }
    },
    {
        name: "playerCommand",
        regex: /"(.+)<(\d+)><\[([\[\]\w:]+)\]><(TERRORIST|CT)>" say(_team)? "(?:[!.\/])(.*)"/,
        data: ["", "name", "playerId", "steamId3", "side", "chatType", "command", "arguments"],
        format: function (match, server) {
            const playerdata = {
                name: match[1],
                playerId: match[2],
                steamId3:  match[3],
                side: match[4]
            }
            return {
                player: server.player.get(server, playerdata),
                isTeamChat: (match[5] == "_team"),
                command: match[6].split(" ")[0],
                arguments: match[6].split(" ").slice(1)
            }
        }
    },
    {
        name: "playerDisconnect",
        regex: /"(.+)<(\d+)><\[([\[\]\w:]+)\]><(TERRORIST|CT|Unassigned|)>" disconnected \(reason "(.+)"\)/,
        data: ["", "name", "playerId", "steamId3", "side", "reason"],
        format: function (match, server) {
            const playerdata = {
                name: match[1],
                playerId: match[2],
                steamId3:  match[3],
                side: match[4]
            }
            return {
                player: server.player.get(server, playerdata),
                reason: match[5]
            }
        }
    },
    {
        name: "playerSwitch",
        regex: /"(.+)<(\d+)><\[([\[\]\w:]+)\]>" switched from team <(Unassigned|Spectator|TERRORIST|CT)> to <(Unassigned|Spectator|TERRORIST|CT)>/,
        data: ["", "name", "playerId", "steamId3", "oldSide", "newSide"],
        format: async function (match, server) {
            const playerdata = {
                name: match[1],
                playerId: match[2],
                steamId3:  match[3],
                side: match[5]
            }
            return {
                player: server.player.get(server, playerdata),
                oldSide: match[4]
            }
        }
    },
    {
        name: "playerPickedUp",
        regex: /"(.+)<(\d+)><\[([\[\]\w:]+)\]><(TERRORIST|CT)>" picked up "(\w+)"/,
        data: ["", "name", "playerId", "steamId3", "side", "weapon"],
        format: function (match, server) {
            const playerdata = {
                name: match[1],
                playerId: match[2],
                steamId3:  match[3],
                side: match[4]
            }
            return {
                player: server.player.get(server, playerdata),
                weapon: match[5]
            }
        }
    },
    {
        name: "matchScoreUpdate",
        regex: /^MatchStatus: Score: (\d+):(\d+) on map "([^"]+)" RoundsPlayed: (\d+)/,
        data: ["", "ctScore", "tScore", "map", "roundPlayed"],
        format: function (match) {
            return {
                score: {
                    ct: match[1],
                    t: match[2]
                },
                map: match[3],
                roundPlayed: match[4]
            }
        }
    },
    {
        name: "roundEnd",
        regex: /^World triggered "(Round_End)"/,
        data: ["", "ctScore", "tScore", "map", "roundPlayed"],
        format: function (match) {
            return {
                score: {
                    ct: match[1],
                    t: match[2]
                },
                map: match[3],
                roundPlayed: match[4]
            }
        }
    },
    {
        name: "teamSideUpdate",
        regex: /MatchStatus: Team playing "(CT|TERRORIST)":\s+(.+)/,
        data: ["", "side", "teamname"],
        format: function (match) {
            return {
                side: match[1],
                teamname: match[2]
            }
        }
    }
    
]

export { events }