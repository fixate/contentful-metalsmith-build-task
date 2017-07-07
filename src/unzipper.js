const fs = require('fs');
const path = require('path');
const unzip = require('unzip');

function extract(source, dest) {
  return new Promise((resolve, reject) => {
    const stream = fs.createReadStream(source)
      .pipe(unzip.Extract({ path: dest }));

    stream.on('finish', () => {
      resolve();
    });

    stream.on('error', (err) => {
      reject(err);
    });
  });
}

module.exports = {
  async unzip({ source, dest }) {
    await extract(source, dest);

    // Find root in dest
    const dirs = fs.readdirSync(dest)
      .filter(file => fs.lstatSync(path.join(dest, file)).isDirectory());

    return dirs ? path.join(dest, dirs[0]) : null;
  },
};
