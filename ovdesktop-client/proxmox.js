Proxmox = function(){
};

Proxmox.auth = function(server, username, password, callback){
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

Proxmox.getSpiceConfig = function(ticket, csrf, server, host, callback){
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

module.exports = Proxmox;
