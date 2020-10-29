const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // 配置入口文件
  entry: './src/index.ts',
  // 配置本地服务
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    port: 9000,
    hot: true
  },
  // 引入loader
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ],
        include: /src/
      },
      {
        test: /\.ts$/,
        use: 'ts-loader',
        include: /src/,
      },
    ]
  },
  // 引入plugin
  plugins: [
    new HtmlWebpackPlugin()
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};