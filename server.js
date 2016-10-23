var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io=require('socket.io').listen(server);
    server.listen(8000);

app.use('/client/',express.static('./client/'));
app.use('/socketio/',express.static(__dirname + '/node_modules/socket.io/'))

//all messages in this array.
var Storage = {
  add: function(msg){
  item = {msg: msg,id: this.setId};
  this.messages.push(item);
  this.setId += 1;
  }
}

var createStorage = function() { // The class prototype for the Storage object
  var storage = Object.create(Storage);
  storage.messages = [];
  storage.setId = 1;
  return storage;
}

var storage = createStorage();

//root dir
app.get('/',function(req,res){
  res.sendfile('./client/index.html')
});

io.sockets.on('connection',function(socket){
  io.sockets.emit('stored-msgs', storage.messages);
  io.sockets.emit('connected',"connected");

  socket.on('send message',function(data){
  storage.add(data);
  io.sockets.emit('new message', data);
  });
});
