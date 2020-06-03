const path = require("path");
const fs = require("fs");
const htmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const distPath = path.resolve(__dirname, "../server/static");
const srcPath = path.resolve(__dirname, "../src");
const entriesPath = path.resolve(__dirname, "entries");

const entry = {};

fs.readdirSync(entriesPath).forEach(file => {
  const fileName = path.basename(file, ".js");
  entry[fileName] = path.resolve(entriesPath, file);
});

module.exports = {
  config: {
    context: srcPath,
    entry,
    output: {
      filename: "scripts/[name].[contenthash].js",
      path: distPath
    },
    module: {
      rules: [
        {
          test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
          use: [
            {
              loader: "file-loader",
              options: {
                name: "[name].[ext]",
                emitFile: false
              }
            }
          ]
        },
        {
          test: /[\\/]content[\\/].*\.(png|jpe?g)$/i,
          loader: "responsive-loader",
          options: {
            name: "[path][name]-[width].[ext]",
            sizes: [320, 480, 640, 720, 1280, 1360, 1920, 2048, 3840]
          }
        },
        {
          test: /[\\/]favicons[\\/].*\.(png|jpe?g)$/i,
          loader: "responsive-loader",
          options: {
            name: "[path][name]-[width].[ext]",
            sizes: [16, 32, 180, 192]
          }
        },
        {
          test: /[\\/]favicons[\\/].*\.(gif|ico|svg)$/i,
          loader: "file-loader",
          options: {
            name: "[path][name].[ext]"
          }
        },
        {
          test: /[\\/]background|icons[\\/].*\.(png|jpe?g|gif|ico|svg)$/i,
          loader: "file-loader",
          options: {
            name: "[path][name].[ext]"
          }
        },
        {
          test: /\.(gif|svg)$/i,
          loader: "file-loader",
          options: {
            name: "[path][name].[ext]"
          }
        }
      ]
    },
    optimization: {
      runtimeChunk: "single",
      splitChunks: {
        chunks: "all",
        maxInitialRequests: Infinity,
        minSize: 0,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              // get the name. E.g. node_modules/packageName/not/this/part.js
              // or node_modules/packageName
              const match = module.context.match(
                /[\\/]node_modules[\\/](.*?)([\\/]|$)/
              );
              const packageName = match ? match[1] : "vendors";

              console.log("\n\n\n", packageName, "\n\n\n");
              // npm package names are URL-safe, but some servers don't like @ symbols
              return `npm.${packageName.replace("@", "")}`;
            }
          }
        }
      }
    },
    plugins: [
      new htmlWebpackPlugin({
        template: path.resolve(srcPath, "index.html"),
        filename: "index.html",
        minify: {
          collapseWhitespace: true,
          collapseInlineTagWhitespace: true,
          removeComments: true
        }
      }),
      new CopyWebpackPlugin([
        {
          from: path.join(srcPath, "fonts"),
          to: `fonts`
        },
        {
          from: path.join(srcPath, "manifest.json"),
          to: ``
        }
      ])
    ]
  },
  vars: { distPath, srcPath }
};
