import {ProvidePlugin, DefinePlugin, optimize} from 'webpack';
import path from 'path';

import config from '../config';

export default {
  module: {
    loaders: [
      {
        test: /\.js$/,
        include: [config.src, config.tests],
        loaders: ['babel'],
      },
      {
        test: /\.json$/,
        include: [
          config.src,
          config.tests,
          path.join(config.root, 'node_modules', 'intl', 'locale-data', 'json'),
        ],
        loaders: ['json'],
      },
      {
        test: /\.(png|svg|eot|ttf|woff)$/,
        loaders: ['url?limit=10000'],
      },
    ],
  },

  debug: config.dev,

  devtool: config.dev ? 'cheap-module-source-map' : 'source-map',

  plugins: [
    new ProvidePlugin({
      'fetch': 'isomorphic-fetch',
    }),

    new DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(
        process.env.NODE_ENV || 'development'
      ),
    }),

    ...(config.prod ? [new optimize.UglifyJsPlugin()] : []),
  ],

  babel: {
    stage: 0,
  },
};
