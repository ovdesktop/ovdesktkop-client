function proxmoxAuth(server, username, password, callback){
  var https = require('https');
  var querystring = require('querystring');
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
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      body += chunk;
    });
  });

  req.on('error', function(e) {
    console.log('problem with request: ' + e.message);
  });

  req.on('close', function() {
    json = JSON.parse(body);
    ticket = json.data.ticket;
    csrf = json.data.CSRFPreventionToken;
    callback(ticket, csrf);
  });

  req.write(data);
  req.end();
};

function proxmoxGetSpiceConfig(ticket, csrf, server, host, file){
  // It works with Curl. For some reason I can't get this working with https request method :(
  var exec = require('child_process').exec, child;
  child = exec('curl -f -s -S -k -b "PVEAuthCookie=' + ticket + '" -H "CSRFPreventionToken: ' + csrf + '" https://' + server + ':8006/api2/spiceconfig/nodes/proxtest/qemu/' + host + '/spiceproxy -d "proxy=proxtest" > ' + file,
    function (error, stdout, stderr) {
      if (error !== null) {
        console.log('exec error: ' + error);
      };
    });
  // With HTTPS request method (not working)
  /*
  var https = require('https');
  var querystring = require('querystring');
  var body = '';

  var cookie = 'PVEAuthCookie=' + ticket;
  var data = querystring.stringify({
    proxy: 'proxtest'
  });

  var options = {
    hostname: server,
    port: 8006,
    rejectUnauthorized: false,
    requestCert: true,
    agent: false,
    path: '/api2/spiceconfig/nodes/proxtest/qemu/101/spiceproxy',
    method: 'POST',
    headers: {
      'CSRFPreventionToken': csrf,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(data)
    }
  };

  var req = https.request(options, function(res) {
    console.log('STATUS: ' + res.statusCode);
    console.log('HEADERS: ' + JSON.stringify(res.headers));
    console.log('Res: ' + res.headersSent);
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      body += chunk;
      console.log('body: ' + chunk);
    });
  });

  req.on('error', function(e) {
    console.log('problem with request: ' + e.message);
  });

  req.write(data);
  req.end();
  */
};

function execSpiceClient(file) {
  var exec = require('child_process').exec, child;
  // Fix: I guess it doesn't work on MacOSX
  child = exec('remote-viewer ' + file + ' -t ovdesktop-client -f',
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

  var server = '10.15.180.39'; // Hardcoded! To do: external config file
  var ticket = '';
  var csrf = '';
  var sconfigfile = '/tmp/spiceproxy'; // Fix: should be multiplatform
  authdata = proxmoxAuth(server, username, password, function (ticket, csrf) {
    proxmoxGetSpiceConfig(ticket, csrf, server, host, sconfigfile);
    execSpiceClient(sconfigfile);
  })
});
