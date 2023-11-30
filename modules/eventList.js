const events = [
    {
        name: "playerSay",
        regex: /"(.+)<(\d+)><([\[\]\w:]+)><(TERRORIST|CT)>" say(_team)? "(.*)"/,
        data: ["", "name", "playerId", "steamId3", "side", "chatType", "text"],
        format: function (match) {
            return {
                player: {
                    name: match[1],
                    playerId: match[2],
                    steamId3:  match[3],
                    side: match[4]
                },
                isTeamChat: (match[5] == "_team"),
                text: match[6]
            }
        }
    },
    {
        name: "playerCommand",
        regex: /"(.+)<(\d+)><([\[\]\w:]+)><(TERRORIST|CT)>" say(_team)? "(?:[!.\/])(.*)"/,
        data: ["", "name", "playerId", "steamId3", "side", "chatType", "command", "arguments"],
        format: function (match) {
            return {
                player: {
                    name: match[1],
                    playerId: match[2],
                    steamId3:  match[3],
                    side: match[4]
                },
                isTeamChat: (match[5] == "_team"),
                command: match[6].split(" ")[0],
                arguments: match[6].split(" ").slice(1)
            }
        }
    },
    {
        name: "playerDisconnect",
        regex: /"(.+)<(\d+)><([\[\]\w:]+)><(TERRORIST|CT|Unassigned|)>" disconnected \(reason "(.+)"\)/,
        data: ["", "name", "playerId", "steamId3", "side", "reason"],
        format: function (match) {
            return {
                player: {
                    name: match[1],
                    playerId: match[2],
                    steamId3:  match[3],
                    side: match[4]
                },
                reason: match[5]
            }
        }
    },
    {
        name: "playerSwitch",
        regex: /"(.+)<(\d+)><([\[\]\w:]+)>" switched from team <(Unassigned|Spectator|TERRORIST|CT)> to <(Unassigned|Spectator|TERRORIST|CT)>/,
        data: ["", "name", "playerId", "steamId3", "oldSide", "newSide"],
        format: function (match) {
            return {
                player: {
                    name: match[1],
                    playerId: match[2],
                    steamId3:  match[3],
                    side: match[5]
                },
                oldSide: match[4]
            }
        }
    }
    
]

export { events }