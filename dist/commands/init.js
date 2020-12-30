"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk = require("chalk");
const fs = require('fs-extra');
const { resolve } = require('path');
const consola = require('consola');
const cwd = process.cwd();
const configPath = resolve(`${cwd}`, 'ati.config.js');
const content = `module.exports = {
  url: '',
  projectId: '',
  token: '',
  output: '',
  groupId: []
}
`;
exports.default = () => {
    if (fs.existsSync(configPath)) {
        consola.info('ati.config.js aready exists!');
    }
    else {
        fs.writeFileSync(resolve(`${cwd}`, 'ati.config.js'), content, { encoding: 'utf8' });
        consola.success(chalk.green('ati.config.js is created!'));
    }
};
