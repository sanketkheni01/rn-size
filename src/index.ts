#! /usr/bin/env node

import { program } from 'commander'
import getAndroidSize from './getAndroidSize.js'

program
  .command('android')
  .option('-l , --log', 'output logs')
  .description('Check the production size of android apk')
  .action(getAndroidSize)

program.parse()
