const path = require('path');

const config = {
  mode: 'development',
  entry: './test/test.ts',
  module: {
    rules: [{
      test: /\.tsx?$/,
      use: 'ts-loader',
      exclude: /node_modules|\.d\.ts$/
    }]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  output: {
    path: path.resolve(__dirname, 'test'),
    filename: 'test.js'
  }
};

module.exports = config;
