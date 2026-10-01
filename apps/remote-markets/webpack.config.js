const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const dependencies = require('./package.json').dependencies;

module.exports = {
  mode: 'development',
  entry: './src/index.ts',
  devtool: 'source-map',

  output: {
    publicPath: 'http://localhost:3001/',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },

  resolve: { extensions: ['.tsx', '.ts', '.jsx', '.js'] },

  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-react', { runtime: 'automatic' }],
              '@babel/preset-typescript',
            ],
          },
        },
      },
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
    ],
  },

  devServer: {
    port: 3001,
    hot: true,
    historyApiFallback: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
  },

  plugins: [
    new ModuleFederationPlugin({
      name: 'remoteMarkets',
      filename: 'remoteEntry.js',
      exposes: {
        './Markets': './src/markets/Markets',
      },
      shared: {
        react: { 
          singleton: true, 
          strictVersion: true, 
          requiredVersion: dependencies.react 
        },
        'react-dom': {
          singleton: true,
          strictVersion: true,
          requiredVersion: dependencies['react-dom'],
        },
        'react/jsx-runtime': {
          singleton: true,
          requiredVersion: dependencies.react,
        },
        'react/jsx-dev-runtime': {
          singleton: true,
          requiredVersion: dependencies.react,
        },
        '@mbg/shared-state': {
          singleton: true,
          requiredVersion: false,
        },
      },
    }),
    new HtmlWebpackPlugin({ template: './public/index.html' }),
  ],
};
