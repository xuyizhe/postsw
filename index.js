#!/usr/bin/env node

const meow = require('meow');
const buildPWA = require('./build.js');

const cli = meow(
  `
	Usage
	  $ postsw <destPath>

	Options
	  --config, -c  Specify a configuration file.
	  --local  Import local workbox-sw.js.
	  --print, -p  Print cache list.

	Examples
	  $ postsw ./dist -p
	  $ postsw ./dist --local
	  $ postsw ./dist --config ./postsw.json
`,
  {
    flags: {
      config: {
        type: 'string',
        alias: 'c',
      },
      local: {
        type: 'boolean',
      },
      print: {
        type: 'boolean',
        alias: 'p',
      },
    },
  }
);

// const args = process.argv.splice(2);

buildPWA(cli);
