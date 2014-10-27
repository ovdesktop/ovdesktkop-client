function proxmoxAuth(server, username, password, callback){
  var https = require('https');
  var querystring = require('querystring');
  var status = '';
  var body = '';
  var ticket = '';
  var csrf = '';

  var data = querystring.stringify({
    username: username,
    password: password
  });

  var options = {
    hostname: server,
    port: 8006,
    rejectUnauthorized: false,
    requestCert: true,
    agent: false,
    path: '/api2/json/access/ticket',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(data)
    }
  };

  var req = https.request(options, function(res) {
    status = res.statusCode;
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      body += chunk;
    });
  });

  req.on('error', function(e) {
    console.log('problem with request: ' + e.message);
  });

  req.on('close', function() {
    if (status == 200) {
      json = JSON.parse(body);
      ticket = json.data.ticket;
      csrf = json.data.CSRFPreventionToken;
    }
    callback(status, ticket, csrf);
  });

  req.write(data);
  req.end();
};

function proxmoxGetSpiceConfig(ticket, csrf, server, host, callback){
  var nodename = 'proxtest'; //FIX: hardcoded, get it from API...
  var https = require('https');
  var querystring = require('querystring');
  var body = '';
  var status = '';

  var cookie = 'PVEAuthCookie=' + ticket;
  var data = querystring.stringify({
    proxy: nodename
  });

  var options = {
    hostname: server,
    port: 8006,
    rejectUnauthorized: false,
    requestCert: true,
    agent: false,
    path: '/api2/spiceconfig/nodes/' + nodename + '/qemu/' + host + '/spiceproxy',
    method: 'POST',
    headers: {
      'CSRFPreventionToken': csrf,
      'Cookie': cookie,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(data)
    }
  };

  var req = https.request(options, function(res) {
    status = res.statusCode;
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      body += chunk;
    });
  });

  req.on('error', function(e) {
    console.log('Problem with request: ' + e.message);
  });

  req.on('close', function() {
    callback(status, body);
  });

  req.write(data);
  req.end();

};

function execSpiceClient(file) {
  var exec = require('child_process').exec, child;
  if (process.platform == 'linux') {
    spiceclient = 'remote-viewer';
    args = '--full-screen';
  } else if (process.platform == 'darwin') {
    spiceclient = '/Applications/RemoteViewer.app/Contents/MacOS/RemoteViewer';
    args = '';
  } else if (process.platform == 'win*') {
    spiceclient = 'c:\Program Files\RemoteViewer\RemoteViewer.exe'; // FIX and test...
    args = '';
  }
  child = exec(spiceclient + ' ' + file + ' ' + args,
    function (error, stdout, stderr) {
      if (error !== null) {
        console.log('exec error: ' + error);
      };
    });
};

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
ipc.on('btnConnect', function(event, arg) {
  username = arg.username;
  password = arg.password;
  host = arg.host;

  var server = '10.15.180.40'; // Hardcoded! To do: external config file
  var ticket = '';
  var csrf = '';

  os = require('os');
  var sconfigfile = os.tmpdir() + '/spiceproxy';

  authdata = proxmoxAuth(server, username, password, function (status, ticket, csrf) {
    if (status == 200) {
      proxmoxGetSpiceConfig(ticket, csrf, server, host, function (status, sconfig) {
        if (status == 200) {
          var fs = require('fs');
          fs.writeFile(sconfigfile, sconfig, function(err) {
            if (err) {
              console.log(error);
            } else {
              execSpiceClient(sconfigfile);
            }
          })
        } else {
          console.log('ERROR: cannot get spice proxy configuration file');
        }
      });
    } else {
      console.log('ERROR: authentication error');
    }
  })
});
