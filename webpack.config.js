const path = require('path');

function generateConfig(name) {
  var uglify = name.indexOf('min') > -1;
  var config = {
    mode: 'development',
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: name + '.js',
      sourceMapFilename: name + '.map',
      library: 'dual-range-bar',
      libraryTarget: 'umd'
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            'style-loader',
            'css-loader'
          ]
        },
        {
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        }
      ]
    }
  };
  config.optimization = {};
  if(uglify) {
    config.optimization.minimize = true;
    config.mode = 'production';
  }
  return config;
};

module.exports = ['dual-range-bar', 'dual-range-bar.min'].map((name) => generateConfig(name));
