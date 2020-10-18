const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

const {
  NODE_ENV = 'development',
  HOST = '0.0.0.0',
  PORT = '8000',
} = process.env;

const dev = NODE_ENV === 'development';
const prod = NODE_ENV === 'production';

module.exports = {

  mode: prod ? 'production' : 'development',
  devtool: dev ? 'source-map' : false,

  entry: './src/index.tsx',

  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },

  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
  },

  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
          },
        },
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin(),
    dev && new ReactRefreshWebpackPlugin(),
  ].filter(Boolean),

  devServer: {
    host: HOST,
    port: Number(PORT),
    hot: true,
  },

};
