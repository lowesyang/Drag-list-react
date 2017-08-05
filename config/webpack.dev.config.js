var webpack = require("webpack");
var path = require("path");

module.exports = {
  entry: {
    demo: './demo/index'
  },
  output: {
    libraryTarget: 'umd',
    library: '[name]',
    path: path.resolve(__dirname, '..', 'dist'),
    publicPath: '/dist/',
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.js[x]?$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test:/\.css$/,
        loader:['style-loader','css-loader?module&localIdentName=[name]__[local]___[hash:base64:5]']
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  plugins: []
}