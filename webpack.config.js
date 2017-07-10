const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: './webrtc-signaling-client.js',
    path: path.resolve(__dirname, 'lib'),
    library: "SignalingClient",
  },
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
    ],
  },
};
