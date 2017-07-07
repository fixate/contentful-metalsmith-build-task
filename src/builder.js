const metalsmithBuilder = require('./builder/metalsmith');

module.exports = function createBuilder(workingDir) {
  return {
    build(config) {
      return metalsmithBuilder(workingDir, config);
    },
  },
};
