var loopback = require('loopback');
var boot = require('loopback-boot');
var express = require('express');
var path = require('path');
var explorer = require('loopback-component-explorer');

var app = module.exports = loopback();

app.use(express.static(path.join(__dirname, '../client')));
app.use('/explorer', explorer.routes(app, {}));
app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    console.log('Web server listening at: %s', app.get('url'));
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
//boot(app, __dirname, function(err) {
//  if (err) throw err;
//
//  // start the server if `$ node server.js`
//  if (require.main === module)
//    app.start();
//});
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
  app.start();
   // app.io = require('socket.io')(app.start());
//var io = require('socket.io').listen(app);
//io.connect();
  var chatTranscript = [];

  var models = app.models();
  models.map(function(model) {
    console.log('Model', model.modelName);
  });
  //app.io.on('connection', function(socket) {
  //  console.log('a user connected');
  //  socket.on('nickName', function(data) {
  //    console.log('Nick Name', data);
  //  });
  //  socket.on('chatMessage', function(data) {
  //    console.log('chat message', data);
  //    chatTranscript.push(data);
  //    app.io.emit('chat message', data);
  //  });
  //  socket.on('draftPickUpdate', function(data) {
  //    socket.broadcast.emit('draftPickUpdate');
  //  });
  //
  //});

  //app.io.on('disconnect', function() {
  //  console.log('user disconnected');
  //});
});
