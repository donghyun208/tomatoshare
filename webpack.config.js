var LiveReloadPlugin = require('webpack-livereload-plugin');
var LiveReloadPluginConfig = new LiveReloadPlugin()


module.exports = {
  entry: [
    './client/index.js'
  ],
  output: {
    path: __dirname + '/server/views',
    filename: "index_bundle.js"
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: [/node_modules/, /server/],
        loaders: "babel-loader"
      }
    ]
  },
  plugins: [LiveReloadPluginConfig]
}
