const fs = require('fs');
const babelrc = JSON.parse(fs.readFileSync('./.babelrc'));
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const extractCSS = new ExtractTextPlugin('styles.css');
const webpack = require('webpack');
const path = require('path');
const devServer = require('./devServer');

module.exports = {
  server: {
    entry: {
      server: [
        path.resolve(__dirname, '..', '..', 'Scripts', 'server.js')
      ]
    },
    resolve: {
      modulesDirectories: [
        'Scripts',
        'node_modules'
      ],
      alias: {
        superagent: path.resolve(__dirname, '..', 'utils', 'superagent-server.js'),
        'promise-window': path.resolve(__dirname, '..', 'utils', 'promise-window-server.js')
      }
    },
    module: {
      loaders: [
        { test: /\.jsx?$/, exclude: /node_modules/, loaders: ['babel?' + JSON.stringify(babelrc), 'eslint'] },
        { test: /\.css$/, loader: 'css/locals?module' },
        { test: /\.scss$/, loader: 'css/locals?module!sass' },
        { test: /\.(woff2?|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file' },
        { test: /\.(jpeg|jpeg|gif|png|tiff)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file' },
        { test: /\.json$/, loader: 'json-loader' }
      ]
    },
    output: {
      filename: '[name].generated.js',
      libraryTarget: 'this',
      path: path.resolve(__dirname, '..', '..', 'wwwroot', 'pack'),
      publicPath: '/pack/'
    },
    plugins: [
      new webpack.DefinePlugin({
        __CLIENT__: false,
        __SERVER__: true,
        __ISDEVELOPMENT__: true
      })
    ]
  },
  entry: {
    client: [
      'bootstrap-loader',
      path.resolve(__dirname, '..', '..', 'Scripts', 'client.js')
    ]
  },
  resolve: {
    modulesDirectories: [
      'Scripts',
      'node_modules'
    ]
  },
  module: {
    loaders: [
      { test: /\.jsx?$/, exclude: /node_modules/, loaders: ['react-hot', 'babel?' + JSON.stringify(babelrc), 'eslint'] },
      { test: /\.css$/, loader: extractCSS.extract('style', 'css?modules') },
      { test: /\.scss$/, loader: extractCSS.extract('style', 'css?modules!sass') },
      { test: /\.(woff2?|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file' },
      { test: /\.(jpeg|jpeg|gif|png|tiff)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file' },
      { test: /\.json$/, loader: 'json-loader' }
    ]
  },
  output: {
    filename: '[name].generated.js',
    libraryTarget: 'this',
    path: path.resolve(__dirname, '..', '..', 'wwwroot', 'pack'),
    publicPath: 'http://' + devServer.host + ':' + devServer.port + '/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    extractCSS,
    new webpack.DefinePlugin({
      __CLIENT__: true,
      __SERVER__: false,
      __ISDEVELOPMENT__: true
    })
  ],
  devtool: 'source-map',
  devServer: {
    host: devServer.host,
    port: devServer.port,
    colors: devServer.colors,
    historyApiFallback: devServer.historyApiFallback,
    hot: devServer.hot,
    inline: devServer.inline,
    stats: devServer.stats,
    contentBase: devServer.contentBase
  }
};
