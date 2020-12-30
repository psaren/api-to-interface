"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAtiConfigs = exports.sleep = exports.isArray = exports.isObject = exports.printPkgVersion = exports.getPkgVersion = exports.getRootPath = void 0;
const path = require("path");
const fs = require('fs-extra');
const consola = require('consola');
function getRootPath() {
    return path.resolve(__dirname, '../../');
}
exports.getRootPath = getRootPath;
function getPkgVersion() {
    return require(path.join(getRootPath(), 'package.json')).version;
}
exports.getPkgVersion = getPkgVersion;
function printPkgVersion() {
    const taroVersion = getPkgVersion();
    console.log(`api-to-interface v${taroVersion}`);
    console.log();
}
exports.printPkgVersion = printPkgVersion;
const isObject = (arg) => Object.prototype.toString.call(arg) === '[object Object]';
exports.isObject = isObject;
const isArray = (arg) => Array.isArray(arg);
exports.isArray = isArray;
const sleep = (timeout) => new Promise((resolve) => setTimeout(resolve, timeout));
exports.sleep = sleep;
const getAtiConfigs = (defaultAtiConfigs = {}) => {
    const cwd = process.cwd();
    const configPath = `${cwd}/ati.config.js`;
    if (!fs.existsSync(configPath)) {
        consola.error('ati.config.js 配置文件不存在！可运行 ati init 初始化配置');
        process.exit(0);
    }
    const userAtiConfig = require(configPath) || {};
    const atiConfigs = Object.assign({}, defaultAtiConfigs, userAtiConfig);
    return atiConfigs;
};
exports.getAtiConfigs = getAtiConfigs;
