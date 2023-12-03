# log2mod
Log2mod makes it possible to write JavaScript plugins for Counter Strike 2. It listens to events via the servers 'log to http' funtion and executes commands with RCON.

## Features
### Finished:
- **no plugins on the server side required**
- handle events logged to console
- easy command handling
- playerlist
- **multiple server support**
  - different configuration per server
- permission system
- send Rcon commands
- easy chat colours

### Planned:
- add all events logged to console
- REST API to be accessed by plugins
- documentation

## Getting started

### Requirements
- nodejs
- log2mod has to be accesable by the server over http
  ( the may require a port forward on the log2mod side )

### Installation
1. Clone the repository
2. Change the IP in 'cfg/log2mod.json' the IP of log2mod
   ( if run on the same PC that the CS2 server/s use the default: "127.0.0.1" )
4. Add your server to 'cfg/serverlist.json'
5. Add plugins in the 'plugins'
6. Run 'node server'
