var app = require('./index.js');

// commands are check (go) or clear (reset)
var send_to_app = {'command': 'check'};

app.handler(send_to_app, null, function(error, result){
    console.log(result);
});
