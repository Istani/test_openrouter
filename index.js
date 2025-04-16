var debug = require("@istani/debug")(require('./package.json').name);

var envpath = __dirname + '/.env';
var config = require('dotenv').config({ path: envpath });
