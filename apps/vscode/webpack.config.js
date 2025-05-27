const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const path = require('path');

//@ts-check
/** @typedef {import('webpack').Configuration} WebpackConfig **/

/** @type WebpackConfig */
module.exports = {
  entry: './src/extension.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'extension.js',
    libraryTarget: 'commonjs2',
  },
  plugins: [
    new NxAppWebpackPlugin({
      target: 'node',
      compiler: 'tsc',
      outputFileName: 'extension.js',
      main: './src/extension.ts',
      tsConfig: './tsconfig.app.json',
      outputHashing: 'none',
      optimization: false,
      externalDependencies: ['vscode'],
      generatePackageJson: true,
    }),
  ],
};
