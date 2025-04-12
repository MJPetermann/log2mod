const Server = {
    on : function(event, callback) {
        
    },
    rcon : function(command, callback) {},
    message : function(message, callback) {},
    log : function(message) {},
    playerlist : {
        get : function(callback) {},
        reload : function(callback) {},
        check : function(callback) {},
    },
    http : {
        get : function(callback) {},
        post : function(message, callback) {},
    },
    command : {
        add : function(command, callback) {},
        remove : function(command, callback) {},
        on : function(event, callback) {},
    },
}
  
export { Server };