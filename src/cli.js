const path = require('path');
const fs = require('fs');

const downloader = require('./downloader');
const unzipper = require('./unzipper');
const builder = require('./builder');

module.exports = { run };

async function loadBuilderConfig(configPath) {
  const isExists = await done => fs.exists(configPath, done);
  if (!isExists) {
    return {};
  }

  return require(configPath);
}

async function run(options) {
  try {
    console.log('Downloading repo zip...');
    const zipPath = await downloader.download({
      url: options.repoZipUrl,
      fileName: 'repo.zip',
    });

    const unzipDest = path.dirname(zipPath);
    console.log(`Unzipping repo to ${unzipDest}...`);
    const repoRoot = await unzipper.unzip({ source: zipPath, dest: unzipDest });

    console.log(`Building source files in ${repoRoot}...`);
    const config = options.configPath ?
      Object.assign({}, options,
        await loadBuilderConfig(path.join(repoRoot, options.configPath))
      ) : options;
    const outputFiles = await builder(repoRoot).build(config);
  } catch (err) {
    console.error(err.stack);
  }
}


