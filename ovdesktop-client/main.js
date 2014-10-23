var app = require('app');
var BrowserWindow = require('browser-window');

require('crash-reporter').start();

var mainWindow = null;

// Quit when all windows are closed
app.on('window-all-closed', function() {
  // But not in MacOS (you know...)
  if (process.platform != 'darwin')
    app.quit();
});

// Ready for creating browser windows
app.on('ready', function() {
  mainWindow = new BrowserWindow({width: 300, height: 500});
  mainWindow.loadUrl('file://' + __dirname + '/index.html');

  // Window closed
  mainWindow.on('closed', function() {
    mainWindow = null;
  });
});

var ipc = require('ipc');
ipc.on('login', function(event, arg) {
  console.log('Username: ' + arg[0]);
  console.log('Password: ' + arg[1]);
  console.log('Host: ' + arg[2]);
  username = arg[0];
  password = arg[1];
  host = arg[3];
  //connect(username, password, host);
});

ipc.on('username', function(event, arg) {
  console.log('Username: ' + arg);  // prints "ping"
  //event.sender.send('asynchronous-reply', 'pong');
});

ipc.on('password', function(event, arg) {
  console.log('Password: ' + arg);
});

ipc.on('host', function(event, arg) {
  console.log('Host: ' + arg);
});
