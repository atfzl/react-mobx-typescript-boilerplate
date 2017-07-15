import * as webpack from 'webpack';
import * as path from 'path';

import HtmlWebpackPlugin = require('html-webpack-plugin');
import ExtractTextPlugin = require('extract-text-webpack-plugin');

const DEBUG = !process.argv.includes('-p');
const sourcePath = path.join(__dirname, './src');
const outPath = path.join(__dirname, './dist');

const GLOBALS = {
  'process.env.NODE_ENV': DEBUG ? '"development"' : '"production"',
  'process.env.BROWSER': true,
  __DEV__: DEBUG,
};

const config: webpack.Configuration = {
  context: sourcePath,
  entry: {
    main: './index.ts',
    vendor: [
      'react',
      'react-dom',
      'react-router',
      'mobx',
      'mobx-react',
      'mobx-react-router',
    ],
  },
  output: {
    path: outPath,
    filename: '[name].bundle.js',
    chunkFilename: '[name].chunk.js',
    publicPath: '/',
  },
  target: 'web',
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
    // Fix webpack's default behavior to not load packages with jsnext:main module
    // (jsnext:main directs not usually distributable es6 format, but es6 sources)
    mainFields: ['module', 'browser', 'main'],
    modules: [path.resolve(sourcePath, 'app'), 'node_modules'],
  },
  module: {
    loaders: [
      // .ts, .tsx
      {
        test: /\.tsx?$/,
        use: DEBUG
          ? ['react-hot-loader', 'awesome-typescript-loader']
          : 'awesome-typescript-loader?module=esnext',
      },
      // css
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              query: {
                modules: true,
                sourceMap: DEBUG,
                importLoaders: 1,
                localIdentName: '[local]__[hash:base64:5]',
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: [
                  require('postcss-import')({ addDependencyTo: webpack }),
                  require('postcss-url')(),
                  require('postcss-cssnext')(),
                  require('postcss-reporter')(),
                  require('postcss-browser-reporter')({
                    disabled: !DEBUG,
                  }),
                ],
              },
            },
          ],
        }),
      },
      // static assets
      { test: /\.html$/, use: 'html-loader' },
      { test: /\.png$/, use: 'url-loader?limit=10000' },
      { test: /\.jpg$/, use: 'file-loader' },
    ],
  },
  plugins: [
    new webpack.DefinePlugin(GLOBALS),
    new webpack.NamedModulesPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'vendor.bundle.js',
      minChunks: Infinity,
    }),
    new webpack.optimize.AggressiveMergingPlugin(),
    new ExtractTextPlugin({
      filename: 'styles.css',
      disable: DEBUG,
    }),
    new HtmlWebpackPlugin({
      template: 'assets/index.html',
    }),
  ],
  devServer: {
    stats: 'errors-only',
  },
  node: {
    // workaround for webpack-dev-server issue
    // https://github.com/webpack/webpack-dev-server/issues/60#issuecomment-103411179
    fs: 'empty',
    net: 'empty',
  },
};

module.exports = config;
