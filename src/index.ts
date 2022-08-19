#! /usr/bin/env node

import { program } from 'commander'

program
  .command('android')
  .description('Check the production size of android apk')
  .action(() => {
    console.log('android')
  })

program.parse()
