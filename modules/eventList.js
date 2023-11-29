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
    
]

export { events }