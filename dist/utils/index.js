"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseTsCode = exports.removeIndexSignatureMiddleWare = exports.removeIndexSignature = exports.getAtiConfigs = exports.sleep = exports.isArray = exports.isObject = exports.printPkgVersion = exports.getPkgVersion = exports.getRootPath = void 0;
const ts = require("typescript");
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
const removeIndexSignature = (members) => {
    return members.filter((item) => {
        var _a, _b;
        if ((item.type.kind === 177 || item.type.kind === 178) && ((_b = (_a = item.type) === null || _a === void 0 ? void 0 : _a.elementType) === null || _b === void 0 ? void 0 : _b.members)) {
            const temp = exports.removeIndexSignature(item.type.elementType.members);
            item.type.elementType.members = temp;
        }
        return item.kind !== 171;
    });
};
exports.removeIndexSignature = removeIndexSignature;
const removeIndexSignatureMiddleWare = (sourceFile) => {
    sourceFile.statements.forEach((item) => {
        if (item.name.kind === 78) {
            item.members = exports.removeIndexSignature(item.members);
        }
    });
};
exports.removeIndexSignatureMiddleWare = removeIndexSignatureMiddleWare;
const parseTsCode = (code, middleWare) => {
    const sourceFile = ts.createSourceFile(__filename, // fileName
    code, // sourceText
    ts.ScriptTarget.Latest // langugeVersion
    );
    if (middleWare) {
        middleWare(sourceFile);
    }
    return ts.createPrinter().printFile(sourceFile);
};
exports.parseTsCode = parseTsCode;
