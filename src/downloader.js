const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

function mkdtemp(prefix) {
  return new Promise((resolve, reject) => {
    fs.mkdtemp(prefix, (err, result) => {
      if (err) { return reject(err); }
      resolve(result);
    });
  });
}

async function download({ url, dest }) {
  try {
    const destPtr = fs.createWriteStream(dest);

    const res = await fetch(url);
    res.body.pipe(destPtr);

    return await new Promise((resolve) => {
      destPtr.on('finish', () => {
        destPtr.close(() => {
          resolve(dest);
        });
      });
    })
  } catch (err) {
    fs.unlink(dest);
    throw err;
  }
}

module.exports = {
  async download({ fileName, url, path: destPath }) {
    const tmpDir = destPath ? destPath : await mkdtemp('/tmp/');
    const dest = path.join(tmpDir, fileName);
    return await download({ url, dest });
  },
};
