const devServer = require("webpack-dev-server");
const wep = require("webpack");
const path = require("path");
const { copy } = require("copy-anything");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const cfg = require("../webpackConfig/webdev.webpack.cfg");
const rewriteIndex = require("./rewriteIndex");
const init = require("./init");
const { exec } = require("child_process");

rewriteIndex(path.resolve(cfg.entry.app[0]));

init();

const cfg_main = copy(cfg);

cfg_main.entry.app = [path.resolve("./server/.code/source/index.js")];
cfg_main.entry.design = [path.resolve("./server/.code/src/index.js")];
cfg_main.plugins.push(
    new HtmlWebpackPlugin({
        template: "./public/template.html",
        filename: "design.html",
        favicon: "./favicon.ico",
        chunks: ["design"]
    })
);

const compiler_main = wep(cfg_main);

const _devServer_main = new devServer(cfg_main.devServer, compiler_main);
exec("nodemon --watch ./server/request.js ./server/request.js");
_devServer_main.start();
