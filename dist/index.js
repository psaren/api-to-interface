"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander = require("commander");
const utils_1 = require("./utils");
commander
    .version(utils_1.getPkgVersion(), '-v, --version');
commander
    .command('run', 'generate api to interface')
    .action((mode) => {
    console.log('mode :>> ', mode);
});
commander
    .command('init', 'init ati.config.js');
commander.on('--help', function () {
});
commander.parse(process.argv);
