const fs = require('fs-extra');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const workboxBuild = require('workbox-build');
const pkg = require('./package.json');
const config = require('./config');

module.exports = function(cli) {
  const destPath = cli.input[0]
    ? path.resolve(process.cwd(), cli.input[0])
    : config.destPath;
  const swDest = path.resolve(destPath, 'sw.js');

  return workboxBuild
    .injectManifest({
      swSrc: path.resolve(__dirname, 'sw.js'),
      swDest: swDest,
      globDirectory: path.resolve(destPath),
      globPatterns: [
        '**/*.{ico,css,ttf,woff,gif,png,js,jpg,svg,woff2,swf,aspx,txt}',
      ],
      maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
    })
    .then(({ count, size, warnings }) => {
      warnings.forEach(console.warn);
      console.log(`${count} files will be precached, totaling ${size} bytes.`);
    })
    .then(() => {
      if (!cli.flags.local) return;
      const from = path.resolve(
        __dirname,
        './node_modules/workbox-cdn/workbox/'
      );
      const to = path.resolve(destPath, 'workbox');

      fs.copy(from, to, (err) => {
        if (err) throw err;
        console.log('Created ' + to);
      });
    })
    .then(() => {
      fs.readFile(swDest, 'utf-8', (err, data) => {
        if (err) throw err;

        if (cli.flags.print) {
          const cacheList = data.match(/precacheAndRoute[^(]*\(([^)]*)\)/)[1];
          console.log(
            util.inspect(JSON.parse(cacheList), { maxArrayLength: null })
          );
        }

        const result = data
          .replace(/'#{cdn\?}'/g, !cli.flags.local)
          .replace(/'#{VERSION}'/g, pkg.version);

        fs.writeFile(swDest, result, (err) => {
          if (err) throw err;
          console.log('Replaced!');
        });
      });
    })
    .then(() => {
      exec(
        `cd ${__dirname} && npx babel ${swDest} -o ${swDest} --minified --no-comments --presets=@babel/preset-env --plugins transform-inline-environment-variables`,
        (err, stdout, stderr) => {
          if (err) throw err;
          console.log('Created ' + swDest);
          stderr && console.log(`stderr: ${stderr}`);
          stdout && console.log(`stdout: ${stdout}`);
        }
      );
    });
};
