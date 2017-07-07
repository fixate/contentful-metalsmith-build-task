const Metalsmith = require('metalsmith');
const markdown = require('metalsmith-markdown');
const dataMarkdown = require('metalsmith-data-markdown');
const layouts = require('metalsmith-layouts');
const permalinks = require('metalsmith-permalinks');
const timer = require('metalsmith-timer');
const contentful = require('contentful-metalsmith');

module.exports = function build(workingDir, config) {
  const {
    metalsmith: metalConf={},
    contentful:contentfulConf={},
    layouts: layoutsConf={},
  } = config;

  return new Promise((resolve, reject) => {
    Metalsmith(workingDir)
      .source(config.sourcePath)
      .clean(false)
      .metadata(metalConf.metadata)
      .use(
        contentful(Object.assign({
          access_token: contentfulConf.accessToken || config.contentfulAccessToken,
          space_id: contentfulConf.spaceId || config.contentfullSpaceId,
        }, contentfulConf)),
      )
      .use(timer('contentful'))
      .use(permalinks())
      .use(timer('permalinks'))
      .use(markdown())
      .use(timer('markdown'))
      .use(
        layouts(layoutsConf)
        // {
        //   directory: `${conf.path.dev.views}/_layouts`,
        //   default: '_default.pug',
        //   engine: 'pug',
        //   pattern: '**/{index,app}.{html,pug}',
        //   // pattern: [
        //   //   'blog/**/index.{pug,html}',
        //   //   '**/_blog.{pug,html}',
        //   // ],

        //   pretty: true,
        //   rename: true,
        // })
      )
      .use(timer('layouts'))
      .use(
        dataMarkdown({
          removeAttributeAfterwards: true,
        })
      )
      .use(timer('data-markdown'))
      .destination(config.outputPath)
      .build((err, files) => {
        if (err) {
          return reject(err);
        }

        return resolve(files);
      });
  });
};
