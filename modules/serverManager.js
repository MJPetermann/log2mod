import event from "events"

class ServerManager extends event.EventEmitter{
    constructor(data){
        super()
        this.name = data.name
        this.ip = data.ip
        this.active = false
    }
    async init(){
        for (const eventCase of eventList) {
            this.on(eventCase.name,(x)=>{
                console.log(eventCase.text)
            })
        }
    }
} 

async function loadServers(){
    let tempArr = []
    for (const server of serverList){
        tempArr.push(new ServerManager({name: server.name, ip: server.ip}))
        await tempArr[(tempArr.length)-1].init()
    }
    return tempArr
}