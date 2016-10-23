var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io=require('socket.io').listen(server);
    server.listen(8000);

app.use('/client/',express.static('./client/'));

//all messages in this array.
var Storage = {
  add: function(obj){
    item = {msg: obj.msg,id: this.setId,name:obj.name};
    this.messages.push(item);

    this.setId += 1;
  },
  addUser: function(obj){
    this.users.push(obj.name);
  }
}

var createStorage = function() { // The class prototype for the Storage object
  var storage = Object.create(Storage);
  storage.messages = [];
  storage.users=[];
  storage.setId = 1;
  return storage;
}

var storage = createStorage();

//root dir
app.get('/',function(req,res){
  res.sendfile('./client/index.html')
});

var usercount=0;

io.sockets.on('connection',function(socket){
  usercount+=1;
  io.sockets.emit('stored-msgs', storage.messages);
  io.sockets.emit('connected',"connected");
  io.sockets.emit('online',usercount);

  socket.on('send message',function(data){
    storage.add(data);
    storage.addUser(data.name);
    io.sockets.emit('new message', data);
  });

  socket.on('disconnect',function(){
    usercount-=1;
    io.sockets.emit('offline',usercount);
  });
});
