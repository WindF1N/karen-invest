const fs = require('fs');
const path = require('path');

module.exports = {
  style: {
    modules: {
      localIdentName: '[hash:base64:5]',
    },
  },
  devServer: {
    port: 80,
    host: "127.0.0.1",
    https: {
      key: fs.readFileSync(path.join(__dirname, 'key.pem')),
      cert: fs.readFileSync(path.join(__dirname, 'cert.pem')),
    },
  },
};
