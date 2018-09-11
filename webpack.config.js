#Pack file
var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'build/public');
var APP_DIR = path.resolve(__dirname, 'src');
var MODULE_DIR = path.resolve(__dirname, 'node_modules');

var config = {
  entry: APP_DIR + '/index.jsx',
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js'
  },
  module: {
	loaders: [
      {
        test: /\.jsx?$/,
		exclude: MODULE_DIR,
        include: APP_DIR,
		loader : 'babel-loader',
		query: {
			presets:['stage-3', 'react']
		}
      },
	  {
		test: /\.css$/,
        loader:"style-loader!css-loader"
	  }
    ]
  }
};

module.exports = config;