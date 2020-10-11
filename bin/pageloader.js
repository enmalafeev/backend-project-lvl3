#!/usr/bin/env node

import commander from 'commander';
import pageloader from '../src/index.js';

const programm = commander;

programm
  .version('0.0.1')
  .description('Download page per url, and save in current directory')
  .option('-o, --output [directory]', 'Output directory', `${process.cwd}`)
  // .arguments('<url>')
  .action((url) => console.log(pageloader(url)))
  .parse(process.argv);
