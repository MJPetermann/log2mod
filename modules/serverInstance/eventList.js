const events = [
    {
        name: "getPlayerMessage",
        regex: /getPlayer_message: "(\w+)"/,
        data: ["", "message"],
        format: function (match) {
            return {
                message: match[1]
            };
        }
    },
    {
        name: "playerCommand",
        regex: /"(.+)<(\d+)><(\[U:\d+:\d+])><(TERRORIST|CT)>" say(_team)? "(?:[!.\/])(.*)"/,
        data: ["", "name", "playerId", "steamId3", "side", "chatType", "command", "arguments"],
        format: function (match, getPlayer) {
            const playerdata = {
                name: match[1],
                playerId: parseInt(match[2], 10),
                steamId3:  match[3],
                side: match[4]
            }
            return {
                player: getPlayer(playerdata),
                isTeamChat: (match[5] == "_team"),
                command: match[6].split(" ")[0],
                arguments: match[6].split(" ").slice(1)
            }
        }
    },
    {
        name: "freezTimeStart",
        regex: /Starting Freeze period/,
        data: [],
        format: function () {
            return {}; // No data to extract, just a trigger.
        }
    },
    {
        name: "worldMatchStart",
        regex: /World triggered "Match_Start" on "(\w+)"/,
        data: ["", "map"],
        format: function (match) {
            return {
                map: match[1]
            };
        }
    },
    {
        name: "worldRoundStart",
        regex: /World triggered "Round_Start"/,
        data: [],
        format: function () {
            return {}; // No data to extract, just a trigger.
        }
    },
    {
        name: "worldRoundRestart",
        regex: /World triggered "Restart_Round_\((\d+)_second\)/,
        data: ["", "seconds"],
        format: function (match) {
            return {
                seconds: parseInt(match[1], 10) // Ensure seconds is an integer.
            };
        }
    },
    {
        name: "worldRoundEnd",
        regex: /World triggered "Round_End"/,
        data: [],
        format: function () {
            return {}; // No data to extract.
        }
    },
    {
        name: "worldGameCommencing",
        regex: /World triggered "Game_Commencing"/,
        data: [],
        format: function () {
            return {}; // No data to extract.
        }
    },
    {
        name: "teamScored",
        regex: /Team "(CT|TERRORIST)" scored "(\d+)" with "(\d+)" players/,
        data: ["", "side", "score", "players"],
        format: function (match) {
            return {
                side: match[1],
                score: parseInt(match[2], 10), // Ensure score is an integer.
                players: parseInt(match[3], 10) // Ensure players is an integer.
            };
        }
    },
    {
        name: "teamNotice",
        regex: /Team "(CT|TERRORIST)" triggered "(\w+)" \(CT "(\d+)"\) \(T "(\d+)"\)/,
        data: ["", "side", "notice", "ctScore", "tScore"],
        format: function (match) {
            return {
                side: match[1],
                notice: match[2],
                ctScore: parseInt(match[3], 10), // Ensure ctScore is an integer.
                tScore: parseInt(match[4], 10) // Ensure tScore is an integer.
            };
        }
    },
    {
        name: "playerConnected",
        regex: /"(.+)<(\d+)><(\[U:\d+:\d+])><>" connected, address "(.*)"/,
        data: ["", "name", "playerId", "steamId3", "address"],
        format: function (match) {
            return {
                name: match[1],
                playerId: parseInt(match[2],10),
                steamId3: match[3],
                address: match[4]
            };
        }
    },
    {
        name: "playerDisconnected",
        regex: /"(.+)<(\d+)><(\[U:\d+:\d+])><(TERRORIST|CT|Unassigned|)>" disconnected \(reason "(.+)"\)/,
        data: ["", "name", "playerId", "steamId3", "side", "reason"],
        format: function (match, getPlayer) {
             const playerdata = {
                name: match[1],
                playerId: parseInt(match[2],10),
                steamId3:  match[3],
                side: match[4]
            }
            return {
                player: getPlayer(playerdata),
                reason: match[5]
            };
        }
    },
    {
        name: "playerEntered",
        regex: /"(.+)<(\d+)><(\[U:\d+:\d+])><>" entered the game/,
        data: ["", "name", "playerId", "steamId3"],
        format: function (match) {
             return {
                name: match[1],
                playerId: parseInt(match[2],10),
                steamId3: match[3]
            };
        }
    },
    {
        name: "playerBanned",
        regex: /Banid: "(.+)<(\d+)><(\[U:\d+:\d+])><\w*>" was banned "([\w. ]+)" by "(\w+)"/,
        data: ["", "name", "playerId", "steamId3", "duration", "banner"],
        format: function(match){
            return {
                name: match[1],
                playerId: parseInt(match[2], 10),
                steamId3: match[3],
                duration: match[4],
                banner: match[5]
            };
        }

    },
    {
        name: "playerSwitch",
        regex: /"(.+)<(\d+)><(\[U:\d+:\d+])>" switched from team <(Unassigned|Spectator|TERRORIST|CT)> to <(Unassigned|Spectator|TERRORIST|CT)>/,
        data: ["", "name", "playerId", "steamId3", "oldSide", "newSide"],
        format: async function (match, getPlayer) {
            const playerdata = {
                name: match[1],
                playerId: parseInt(match[2],10),
                steamId3:  match[3],
                side: match[5]
            }
            return {
                player: getPlayer(playerdata),
                oldSide: match[4]
            };
        }
    },
    {
        name: "playerSay",
        regex: /"(.+)<(\d+)><(\[U:\d+:\d+])><(TERRORIST|CT)>" say(_team)? "(.*)"/,
        data: ["", "name", "playerId", "steamId3", "side", "chatType", "text"],
        format: function (match, getPlayer) {
            const playerdata = {
                name: match[1],
                playerId: parseInt(match[2],10),
                steamId3:  match[3],
                side: match[4]
            }
            return {
                player: getPlayer(playerdata),
                isTeamChat: (match[5] == "_team"),
                text: match[6]
            };
        }
    },
    {
        name: "playerPurchase",
        regex: /"(.+)<(\d+)><(\[U:\d+:\d+])><(TERRORIST|CT)>" purchased "(\w+)"/,
        data: ["", "name", "playerId", "steamId3", "side", "weapon"],
        format: function (match, getPlayer) {
            const playerdata = {
                name: match[1],
                playerId: parseInt(match[2],10),
                steamId3:  match[3],
                side: match[4]
            }
            return {
                player: getPlayer(playerdata),
                weapon: match[5]
            };
        }
    },
    // {
    //     name: "playerKill",
    //     regex: /"(.+)<(\d+)><(\[U:\d+:\d+])><(TERRORIST|CT)>" \[(-?\d+) (-?\d+) (-?\d+)\] killed "(.+)<(\d+)><(\[U:\d+:\d+])><(TERRORIST|CT)>" \[(-?\d+) (-?\d+) (-?\d+)\] with "(\w+)" ?(\(?(headshot|penetrated|headshot penetrated)?\))?/,
    //     data: ["", "attackerName", "attackerPlayerId", "attackerSteamId3", "attackerSide", "attackerPosX", "attackerPosY", "attackerPosZ", "victimName", "victimPlayerId", "victimSteamId3", "victimSide", "victimPosX", "victimPosY", "victimPosZ", "weapon", "damageType"],
    //     format: function (match, getPlayer) {
    //         const attackerData = {
    //             name: match[1],
    //             playerId: parseInt(match[2],10),
    //             steamId3:  match[3],
    //             side: match[4]
    //         }
    //         const victimData = {
    //             name: match[8],
    //             playerId: parseInt(match[9],10),
    //             steamId3:  match[10],
    //             side: match[11]
    //         }
    //         return {
    //             attacker: getPlayer(attackerData),
    //             victim: getPlayer(victimData),
    //             attackerPosX: parseInt(match[5], 10),
    //             attackerPosY: parseInt(match[6], 10),
    //             attackerPosZ: parseInt(match[7], 10),
    //             victimPosX: parseInt(match[12], 10),
    //             victimPosY: parseInt(match[13], 10),
    //             victimPosZ: parseInt(match[14], 10),
    //             weapon: match[15],
    //             damageType: match[16] || "" // Ensure damageType is not undefined.
    //         };
    //     }
    // },
    // {
    //     name: "playerKillAssist",
    //     regex: /"(.+)<(\d+)><(\[U:\d+:\d+])><(TERRORIST|CT)>" assisted killing "(.+)<(\d+)><(\[U:\d+:\d+])><(TERRORIST|CT)>"/,
    //     data: ["", "attackerName", "attackerPlayerId", "attackerSteamId3", "attackerSide", "victimName", "victimPlayerId", "victimSteamId3", "victimSide"],
    //     format: function (match, getPlayer) {
    //         const attackerData = {
    //             name: match[1],
    //             playerId: parseInt(match[2],10),
    //             steamId3:  match[3],
    //             side: match[4]
    //         }
    //         const victimData = {
    //             name: match[5],
    //             playerId: parseInt(match[6],10),
    //             steamId3:  match[7],
    //             side: match[8]
    //         }
    //         return {
    //             attacker: getPlayer(attackerData),
    //             victim: getPlayer(victimData)
    //         };
    //     }
    // },
    // {
    //     name: "playerAttack",
    //     regex: /"(.+)<(\d+)><(\[U:\d+:\d+])><(TERRORIST|CT)>" \[(-?\d+) (-?\d+) (-?\d+)\] attacked "(.+)<(\d+)><(\[U:\d+:\d+])><(TERRORIST|CT)>" \[(-?\d+) (-?\d+) (-?\d+)\] with "(\w+)" \(damage "(\d+)"\) \(damage_armor "(\d+)"\) \(health "(\d+)"\) \(armor "(\d+)"\) \(hitgroup "([\w ]+)"\)/,
    //     data: ["", "attackerName", "attackerPlayerId", "attackerSteamId3", "attackerSide", "attackerPosX", "attackerPosY", "attackerPosZ", "victimName", "victimPlayerId", "victimSteamId3", "victimSide", "victimPosX", "victimPosY", "victimPosZ", "weapon", "damage", "damageArmor", "health", "armor", "hitgroup"],
    //     format: function (match, getPlayer) {
    //         const attackerData = {
    //             name: match[1],
    //             playerId: parseInt(match[2],10),
    //             steamId3:  match[3],
    //             side: match[4]
    //         }
    //         const victimData = {
    //             name: match[8],
    //             playerId: parseInt(match[9],10),
    //             steamId3:  match[10],
    //             side: match[11]
    //         }
    //         return {
    //             attacker: getPlayer(attackerData),
    //             victim: getPlayer(victimData),
    //             attackerPosX: parseInt(match[5], 10),
    //             attackerPosY: parseInt(match[6], 10),
    //             attackerPosZ: parseInt(match[7], 10),
    //             victimPosX: parseInt(match[12], 10),
    //             victimPosY: parseInt(match[13], 10),
    //             victimPosZ: parseInt(match[14], 10),
    //             weapon: match[15],
    //             damage: parseInt(match[16], 10),
    //             damageArmor: parseInt(match[17], 10),
    //             health: parseInt(match[18], 10),
    //             armor: parseInt(match[19], 10),
    //             hitgroup: match[20]
    //         };
    //     }
    // },
    // {
    //     name: "playerKilledByBomb",
    //     regex: /"(.+)<(\d+)><(\[U:\d+:\d+])><(TERRORIST|CT)>" \[(-?\d+) (-?\d+) (-?\d+)\] was killed by the bomb\./,
    //     data: ["", "playerName", "playerId", "steamId3", "side", "posX", "posY", "posZ"],
    //     format: function (match, getPlayer) {
    //         const playerdata = {
    //             name: match[1],
    //             playerId: parseInt(match[2],10),
    //             steamId3:  match[3],
    //             side: match[4]
    //         }
    //         return {
    //             player: getPlayer(playerdata),
    //             posX: parseInt(match[5], 10),
    //             posY: parseInt(match[6], 10),
    //             posZ: parseInt(match[7], 10)
    //         };
    //     }
    // },
    // {
    //     name: "playerKilledSuicide",
    //     regex: /"(.+)<(\d+)><(\[U:\d+:\d+])><(TERRORIST|CT)>" \[(-?\d+) (-?\d+) (-?\d+)\] committed suicide with "(.*)"/,
    //     data: ["", "playerName", "playerId", "steamId3", "side", "posX", "posY", "posZ", "weapon"],
    //     format: function (match, getPlayer) {
    //          const playerdata = {
    //             name: match[1],
    //             playerId: parseInt(match[2],10),
    //             steamId3:  match[3],
    //             side: match[4]
    //         }
    //         return {
    //             player: getPlayer(playerdata),
    //             posX: parseInt(match[5], 10),
    //             posY: parseInt(match[6], 10),
    //             posZ: parseInt(match[7], 10),
    //             weapon: match[8]
    //         };
    //     }
    // },
    {
        name: "playerPickedUp",
        regex: /"(.+)<(\d+)><(\[U:\d+:\d+])><(TERRORIST|CT)>" picked up "(\w+)"/,
        data: ["", "name", "playerId", "steamId3", "side", "weapon"],
        format: function (match, getPlayer) {
            const playerdata = {
                name: match[1],
                playerId: parseInt(match[2],10),
                steamId3:  match[3],
                side: match[4]
            }
            return {
                player: getPlayer(playerdata),
                weapon: match[5]
            };
        }
    },
    {
        name: "playerDropped",
        regex: /"(.+)<(\d+)><(\[U:\d+:\d+])><(TERRORIST|CT|Unassigned)>" dropped "(\w+)"/,
        data: ["", "name", "playerId", "steamId3", "side", "weapon"],
        format: function (match, getPlayer) {
            const playerdata = {
                name: match[1],
                playerId: parseInt(match[2],10),
                steamId3:  match[3],
                side: match[4]
            }
            return {
                player: getPlayer(playerdata),
                weapon: match[5]
            };
        }
    },
    // {
    //     name: "playerMoneyChange",
    //     regex: /"(.+)<(\d+)><(\[U:\d+:\d+])><(TERRORIST|CT)>" money change (\d+)\+?(-?\d+) = \$(\d+) \(tracked\)( \(purchase: (\w+)\))?/,
    //     data: ["", "name", "playerId", "steamId3", "side", "initialMoney", "moneyChange", "newMoney", "purchase"],
    //     format: function (match, getPlayer) {
    //         const playerdata = {
    //             name: match[1],
    //             playerId: parseInt(match[2],10),
    //             steamId3:  match[3],
    //             side: match[4]
    //         }
    //         return {
    //             player: getPlayer(playerdata),
    //             initialMoney: parseInt(match[5], 10),
    //             moneyChange: parseInt(match[6], 10),
    //             newMoney: parseInt(match[7], 10),
    //             purchase: match[9] || "" // Ensure purchase is not undefined
    //         };
    //     }
    // },
    // {
    //     name: "playerBombGot",
    //     regex: /"(.+)<(\d+)><(\[U:\d+:\d+])><(TERRORIST|CT)>" triggered "Got_The_Bomb"/,
    //     data: ["", "name", "playerId", "steamId3", "side"],
    //     format: function (match, getPlayer) {
    //         const playerdata = {
    //             name: match[1],
    //             playerId: parseInt(match[2],10),
    //             steamId3:  match[3],
    //             side: match[4]
    //         }
    //         return {
    //             player: getPlayer(playerdata)
    //         };
    //     }
    // },
    // {
    //     name: "playerBombPlanted",
    //     regex: /"(.+)<(\d+)><(\[U:\d+:\d+])><(TERRORIST|CT)>" triggered "Planted_The_Bomb"/,
    //     data: ["", "name", "playerId", "steamId3", "side"],
    //     format: function (match, getPlayer) {
    //          const playerdata = {
    //             name: match[1],
    //             playerId: parseInt(match[2],10),
    //             steamId3:  match[3],
    //             side: match[4]
    //         }
    //         return {
    //             player: getPlayer(playerdata)
    //         };
    //     }
    // },
    // {
    //     name: "playerBombDropped",
    //     regex: /"(.+)<(\d+)><(\[U:\d+:\d+])><(TERRORIST|CT)>" triggered "Dropped_The_Bomb"/,
    //     data: ["", "name", "playerId", "steamId3", "side"],
    //     format: function (match, getPlayer) {
    //         const playerdata = {
    //             name: match[1],
    //             playerId: parseInt(match[2],10),
    //             steamId3:  match[3],
    //             side: match[4]
    //         }
    //         return {
    //             player: getPlayer(playerdata)
    //         };
    //     }
    // },
    // {
    //     name: "playerBombBeginDefuse",
    //     regex: /"(.+)<(\d+)><(\[U:\d+:\d+])><(TERRORIST|CT)>" triggered "Begin_Bomb_Defuse_With(out)?_Kit"/,
    //     data: ["", "name", "playerId", "steamId3", "side", "withKit"],
    //     format: function (match, getPlayer) {
    //         const playerdata = {
    //             name: match[1],
    //             playerId: parseInt(match[2],10),
    //             steamId3:  match[3],
    //             side: match[4]
    //         }
    //         return {
    //             player: getPlayer(playerdata),
    //             withKit: !match[5] // If "out" is present, withKit is false, otherwise true.
    //         };
    //     }
    // },
    // {
    //     name: "playerBombDefused",
    //     regex: /"(.+)<(\d+)><(\[U:\d+:\d+])><(TERRORIST|CT)>" triggered "Defused_The_Bomb"/,
    //     data: ["", "name", "playerId", "steamId3", "side"],
    //     format: function (match, getPlayer) {
    //         const playerdata = {
    //             name: match[1],
    //             playerId: parseInt(match[2],10),
    //             steamId3:  match[3],
    //             side: match[4]
    //         }
    //         return {
    //             player: getPlayer(playerdata)
    //         };
    //     }
    // },
    // {
    //     name: "playerThrew",
    //     regex: /"(.+)<(\d+)><(\[U:\d+:\d+])><(TERRORIST|CT)>" threw (\w+) \[(-?\d+) (-?\d+) (-?\d+)\]( flashbang entindex (\d+))?/,
    //     data: ["", "name", "playerId", "steamId3", "side", "grenade", "posX", "posY", "posZ", "flashbangEntindex"],
    //     format: function (match, getPlayer) {
    //         const playerdata = {
    //             name: match[1],
    //             playerId: parseInt(match[2],10),
    //             steamId3:  match[3],
    //             side: match[4]
    //         }
    //         return {
    //             player: getPlayer(playerdata),
    //             grenade: match[5],
    //             posX: parseInt(match[6], 10),
    //             posY: parseInt(match[7], 10),
    //             posZ: parseInt(match[8], 10),
    //             flashbangEntindex: match[10] ? parseInt(match[10], 10) : null // Optional value.
    //         };
    //     }
    // },
    // {
    //     name: "playerBlinded",
    //     regex: /"(.+)<(\d+)><(\[U:\d+:\d+])><(TERRORIST|CT)>" blinded for ([\d.]+) by "(.+)<(\d+)><(\[U:\d+:\d+])><(TERRORIST|CT)>" from flashbang entindex (\d+)/,
    //     data: ["", "victimName", "victimPlayerId", "victimSteamId3", "victimSide", "duration", "attackerName", "attackerPlayerId", "attackerSteamId3", "attackerSide", "flashbangEntindex"],
    //     format: function (match, getPlayer) {
    //        const attackerData = {
    //             name: match[6],
    //             playerId: parseInt(match[7],10),
    //             steamId3:  match[8],
    //             side: match[9]
    //         }
    //         const victimData = {
    //             name: match[1],
    //             playerId: parseInt(match[2],10),
    //             steamId3:  match[3],
    //             side: match[4]
    //         }
    //         return {
    //             attacker: getPlayer(attackerData),
    //             victim: getPlayer(victimData),
    //             duration: parseFloat(match[5]), // Duration can be a floating-point number.
    //             flashbangEntindex: parseInt(match[10], 10)
    //         };
    //     }
    // },
    // {
    //     name: "projectileSpawned",
    //     regex: /Molotov projectile spawned at (-?\d+\.\d+) (-?\d+\.\d+) (-?\d+\.\d+), velocity (-?\d+\.\d+) (-?\d+\.\d+) (-?\d+\.\d+)/,
    //     data: ["", "posX", "posY", "posZ", "velX", "velY", "velZ"],
    //     format: function (match) {
    //         return {
    //             posX: parseFloat(match[1]), // Coordinates can be floating-point numbers.
    //             posY: parseFloat(match[2]),
    //             posZ: parseFloat(match[3]),
    //             velX: parseFloat(match[4]),
    //             velY: parseFloat(match[5]),
    //             velZ: parseFloat(match[6])
    //         };
    //     }
    // },
    {
        name: "gameOver",
        regex: /Game Over: (\w+) (\w+) (\w+) score (\d+):(\d+) after (\d+) min/,
        data: ["", "gameMode", "subMode", "map", "ctScore", "tScore", "duration"],
        format: function (match) {
            return {
                gameMode: match[1],
                subMode: match[2],
                map: match[3],
                ctScore: parseInt(match[4], 10), // Ensure scores are integers.
                tScore: parseInt(match[5], 10),
                duration: parseInt(match[6], 10) // Ensure duration is an integer.
            };
        }
    }
];


export { events };