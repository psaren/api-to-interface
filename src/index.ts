import * as commander from 'commander'

import { getPkgVersion } from './utils'

commander
  .version(getPkgVersion(), '-v, --version')

commander
  .command('run', 'generate api to interface')
  .action((mode) => {
    console.log('mode :>> ', mode)
  })

commander
  .command('init', 'init ati.config.js')

commander.on('--help', function () {

})

commander.parse(process.argv)
