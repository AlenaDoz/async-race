const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
module.exports = {
  entry: path.join(__dirname, './src/index.ts'),
  output: {
    filename: 'index.js',
    path: path.join(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          'style-loader', 'css-loader'
        ]
      },
      {
        test: /\.ts$/i,
        use: [
          'ts-loader'
        ]
      }
    ]
  },
  resolve: {
    extensions: [
      '.ts', '.js', '.json'
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, './src/index.html'),
      filename: 'index.html'
    }),
    new CleanWebpackPlugin()
  ]
}
