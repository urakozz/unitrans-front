var path = require('path');
var webpack = require('webpack');
var WebpackMd5Hash    = require('webpack-md5-hash');
var HtmlWebpackPlugin = require('html-webpack-plugin');

test = {
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
  module: {
    loaders: [
      {
        test: /\.ts$/,
        loader: 'awesome-typescript',
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

// https://github.com/ghillert/angular2-webpack-starter-bootstrap
module.exports = {
  entry: [
    path.normalize('es6-shim/es6-shim.min'),
    'reflect-metadata',
    path.normalize('zone.js/dist/zone'),
    './app/boot.ts',
  ],
  output: {
    path: path.resolve('build/webpack'),
    filename: 'unitrans.js',
  },
  //devtool: 'source-map',
  resolve: {
    extensions: ['', '.ts', '.js']
  },
  module: {
    loaders: [
      { test: /\.ts$/, loader: 'awesome-typescript'},
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
    new webpack.optimize.UglifyJsPlugin({

      beautify: false,//prod
      mangle: false,
      compress : { screw_ie8 : true},//prod
      comments: false//prod

    }),
    new HtmlWebpackPlugin({
      template: 'index_prod.tpl.html',
      filename: 'index.html',
      inject:false,
      hash: true,
      cache:false
    })
  ]
};
