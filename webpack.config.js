const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

function generateConfig(name) {
  var uglify = name.indexOf('min') > -1;
  var config = {
    mode: 'development',
    entry: './src/index.ts',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: name + '.js',
      sourceMapFilename: name + '.map',
      library: 'dual-range-bar',
      libraryTarget: 'umd',
      umdNamedDefine: true
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js']
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/
        },
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
  if(uglify) {
    config.optimization = {
      minimize: true, minimizer: [ new TerserPlugin() ]
    }
    config.mode = 'production';
  }
  return config;
};

module.exports = ['dual-range-bar', 'dual-range-bar.min'].map((name) => generateConfig(name));
