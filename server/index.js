const devServer = require("webpack-dev-server");
const wep = require("webpack");
const path = require("path");
const { copy } = require("copy-anything");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const cfg = require("../webpackConfig/dev.webpack.cfg");
const fs = require("fs-extra");
// const init = require("./init");
const { exec } = require("child_process");
const utils = require("./util");

utils.injectIndex(path.resolve(cfg.entry.app[0]));

(() => {
    // 复制文件
    if (!fs.existsSync(path.resolve("./server/.code/src"))) {
        fs.mkdirSync(path.resolve("./server/.code/src"), { recursive: true });
    }
    fs.copySync(path.resolve("./src/index.js"), path.resolve("./server/.code/src/index.js"));
    fs.copySync(path.resolve("./src/App.js"), path.resolve("./server/.code/src/App.js"));
    fs.copySync(path.resolve("./src/app.less"), path.resolve("./server/.code/src/app.less"));

    // 处理js
    utils.traverseApp();
    utils.traverseIndex();
})();

// init();

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

compiler_main.hooks.done.tap("done", stats => {
    console.info(`耗时：${(stats.endTime - stats.startTime) / 1000}s`);
});

const _devServer_main = new devServer(cfg_main.devServer, compiler_main);
exec("nodemon --watch ./server/request.js ./server/request.js");
_devServer_main.start();
