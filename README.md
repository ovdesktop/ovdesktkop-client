ovdesktkop-client
=================

This is a proof of concept to check if it's possible to build a VDI (Virtual Desktop Infraestructure) environment with Proxmox3

Instructions
-------------
First, don't forget to configure ovdesktop-client with your authentication data. You can use the template included in the package:

```
cd ovdesktop-client/
mv config.js.dist config.js
```

Now edit `config.js` file. It should have something like that:

```
var config = {}

config.proxmox = {};

config.proxmox.server = '192.168.1.10';
config.proxmox.username = 'root@pam';
config.proxmox.password = '12341234';
config.proxmox.vmid = '101';

module.exports = config;
```


Now, we need to prepare the environment:

```bash
./bootstrap.sh
```

Build the package:

```bash
./build.sh
```

Run it!!
