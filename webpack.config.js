var nib = require('nib');
var webpack = require('webpack');

module.exports = {
  entry: './src/bootstrap.jsx',
  output: {
    path: __dirname + '/dist',
    filename: 'index.js'
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
  module: {
    loaders: [
      { test: /\.jsx?$/, loaders: ['babel'], exclude: /node_modules/ },
      { test: /\.styl$/, loader: 'style-loader!css-loader!stylus-loader', exclude: /node_modules/ }
    ]
  },
  stylus: {
    use: [nib()]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({ minimize: true })
  ]
};
