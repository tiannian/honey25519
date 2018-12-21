let nacl = require('../lib/nacl.js');

let keys = nacl.sign.keyPair();

console.log(keys);