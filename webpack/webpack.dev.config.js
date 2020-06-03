const merge = require("webpack-merge");
const webpack = require("webpack");
const { config, vars } = require("./webpack.common.config");

module.exports = merge(config, {
  mode: "development",
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          { loader: "style-loader", options: { sourceMap: true } },
          { loader: "css-loader", options: { sourceMap: true } },
          { loader: "sass-loader", options: { sourceMap: true } }
        ]
      }
    ]
  },
  devtool: "eval-source-map",
  devServer: {
    port: 4000,
    publicPath: "/",
    contentBase: vars.distPath,
    overlay: true
  },
  plugins: [new webpack.NamedChunksPlugin()]
});
