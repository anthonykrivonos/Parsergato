'use strict';
const manip = require('./manip.js');

global.instance = 0;

var info = (msg) => {
      console.log(`INFO  :: ${manip.pad(global.instance++)} :: ${msg}`);
};

var error = (msg) => {
      console.error(`ERROR :: ${manip.pad(global.instance++)} :: ${msg}`);
};

module.exports = {
      info, error
};
