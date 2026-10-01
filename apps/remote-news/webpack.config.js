const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const deps = require('./package.json').dependencies;

module.exports = {
  mode: 'development',
  entry: './src/index.ts',
  devtool: 'source-map',

  output: {
    publicPath: 'http://localhost:3002/',
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
    port: 3002,
    hot: true,
    historyApiFallback: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
  },

  plugins: [
    new ModuleFederationPlugin({
      name: 'remoteNews',
      filename: 'remoteEntry.js',
      exposes: {
        './News': './src/news/News',
      },
      shared: {
        react: { 
          singleton: true, 
          strictVersion: true, 
          requiredVersion: deps.react 
        },
        'react-dom': {
          singleton: true,
          strictVersion: true,
          requiredVersion: deps['react-dom'],
        },
        'react/jsx-runtime': {
          singleton: true,
          requiredVersion: deps.react,
        },
        'react/jsx-dev-runtime': {
          singleton: true,
          requiredVersion: deps.react,
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
