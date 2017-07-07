const yargs = require('yargs');

const cli = require('./cli');

const { env } = process;

const config = yargs
  .showHelpOnFail(true)
  .option('repo-zip-url', {
    describe: 'URL to your zip',
    default: env.REPO_ZIP_URL,
  })
  .option('contentful-space-id', {
    describe: 'Contentful space id',
    default: env.CONTENTFUL_SPACE_ID,
  })
  .option('contentful-access-token', {
    describe: 'Contentful access token',
    default: env.CONTENTFUL_ACCESS_TOKEN,
  })
  .option('config-path', {
    describe: 'Optional builder configuration relative to repo root (.js or json)',
    default: 'metalsmith-builder',
  })
  .option('source-path', {
    describe: 'Metalsmith source path',
    default: '/src',
  })
  .option('output-path', {
    describe: 'Metalsmith desination path',
  })
  .demandOption(['repo-zip-url'])
  .argv;

// Run the app
cli.run(config);
