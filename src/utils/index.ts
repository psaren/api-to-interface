import * as path from 'path'
const fs = require('fs-extra')
const consola = require('consola')

export function getRootPath (): string {
  return path.resolve(__dirname, '../../')
}

export function getPkgVersion (): string {
  return require(path.join(getRootPath(), 'package.json')).version
}

export function printPkgVersion () {
  const taroVersion = getPkgVersion()
  console.log(`api-to-interface v${taroVersion}`)
  console.log()
}

export const isObject = (arg): boolean => Object.prototype.toString.call(arg) === '[object Object]'

export const isArray = (arg): boolean => Array.isArray(arg)

export const sleep = (timeout) => new Promise((resolve) => setTimeout(resolve, timeout))

export const getAtiConfigs = (defaultAtiConfigs = {}) => {
  const cwd = process.cwd()
  const configPath = `${cwd}/ati.config.js`
  if (!fs.existsSync(configPath)) {
    consola.error('ati.config.js 配置文件不存在！可运行 ati init 初始化配置')
    process.exit(0)
  }
  const userAtiConfig = require(configPath) || {}
  const atiConfigs = Object.assign({}, defaultAtiConfigs, userAtiConfig)
  return atiConfigs
}
