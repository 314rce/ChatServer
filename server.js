// var mongo = require('mongodb').MongoClient;
var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io=require('socket.io').listen(server);
    server.listen(8000);
// var myCollection;
// var db = mongo.connect('mongodb://127.0.0.1:27017/chat', function(err, db) {
//     if(err)
//         throw err;
//     console.log("connected to the mongoDB !");
//     myCollection = db.collection('messages');
//   }
// );

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

//update chat messages
// app.post('/',function(res){
//   var messages = db.messages.find().forEach(span(this.name,this.message));
//   res.sendStatus(201);
//   res.json(messages);
// });

io.sockets.on('connection',function(socket){
  io.sockets.emit('stored-msgs', storage.messages);
  io.sockets.emit('connected',"connected");

  socket.on('send message',function(data){
  storage.add(data);
  io.sockets.emit('new message', data);
  });
});
