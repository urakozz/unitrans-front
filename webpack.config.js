"use strict";

var PROD = JSON.parse(process.env.PROD || '0');

var path = require('path');
var webpack = require('webpack');
var WebpackMd5Hash    = require('webpack-md5-hash');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

var test = {
  entry: [
    path.normalize('es6-shim/es6-shim.min'),
    'reflect-metadata',
    path.normalize('zone.js/dist/zone'),
    path.resolve('app/app')
  ],
  output: {
    path: path.resolve('www/build/js'),
    filename: 'unitrans.[chunkhash].js',
    pathinfo: false // show module paths in the bundle, handy for debugging
  },
  devServer: {
        // This is required for webpack-dev-server. The path should
        // be an absolute path to your build destination.
        //@todo
        outputPath: path.join(__dirname, 'www/build')
    },
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.ts$/,
        loader: 'awesome-typescript-loader',
        query: {
          doTypeCheck: true,
          resolveGlobs: false,
          externals: ['typings/browser.d.ts']
        },
        include: path.resolve('app'),
        exclude: /node_modules/
      },
      {
        test: /\.js$/,
        include: path.resolve('node_modules/angular2'),
        loader: 'strip-sourcemap'
      },
      {
        test: /\.js$/,
        include: path.resolve('node_modules/ng2-material'),
        loader: 'strip-sourcemap'
      }
    ],
    noParse: [
      /es6-shim/,
      /reflect-metadata/,
      /zone\.js(\/|\\)dist(\/|\\)zone/
    ]
  },
  resolve: {
    root: ['app'],
    alias: {
      'angular2': path.resolve('node_modules/angular2'),
    },
    extensions: ["", ".js", ".ts"]
  }
};


// Config
let config = {
  entry: [
    path.normalize('es6-shim/es6-shim.min'),
    path.normalize('whatwg-fetch/fetch'),
    // path.normalize('zeroclipboard/dist/ZeroClipboard'),
    'reflect-metadata',
    path.normalize('zone.js/dist/zone'),
    './app/boot.ts',
  ],
  output: {
    path: path.resolve('build/webpack'),
    //filename: 'unitrans.[chunkhash].js',
    filename: 'unitrans.js',
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['', '.ts', '.js']
  },
  module: {
    loaders: [
      {
        test: /\.ts$/,
        loader: 'awesome-typescript-loader',
        exclude: /node_modules/,
        query: {
          useCache:true
        },
      },
    ],
    noParse: [
      /es6-shim/,
      /reflect-metadata/,
      /zone\.js(\/|\\)dist(\/|\\)zone/
    ]
  },

  plugins: [
    new WebpackMd5Hash(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(true),
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'polyfills',
    //   filename: 'polyfills.[chunkhash].bundle.js',
    //   chunks: Infinity
    // }),

    new HtmlWebpackPlugin({
      template: 'index.prod.tpl.html',
      filename: 'index.html',
      inject:false,
      hash: true,
      window:{
        __production:PROD
      }
    })
    //new CopyWebpackPlugin([{ from: 'app/**/.html', to: 'app' }])
  ]
};

if(PROD) {
  config.output.filename = 'unitrans.[chunkhash].js'
  config.plugins.push(new webpack.optimize.UglifyJsPlugin({

    beautify: false,//prod
    mangle: false,
    compress : { screw_ie8 : true},//prod
    comments: false//prod

  }))
  config.devtools = undefined
}

// https://github.com/ghillert/angular2-webpack-starter-bootstrap


module.exports = config
