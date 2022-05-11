const http = require("http");
const url = require("url");
const fs = require("fs");
const path = require("path");
const qs = require("qs");
const template = require("@babel/template").default;
const { astRoute, getComCfg, getRouteCompName, initCode } = require("./util");

http.createServer((req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.setHeader("Content-Type", "application/json;charset=utf-8");
    if (req.url == "/addRouter") {
        res.end(true);
    }

    if (url.parse(req.url).pathname == "/getLost") {
        let arr = new Array(52).fill(null);
        arr = arr.map(v => {
            return {
                a: parseInt(Math.random() * 10000),
                b: parseInt(Math.random() * 10000),
                c: parseInt(Math.random() * 10000),
                d: parseInt(Math.random() * 10000),
                e: parseInt(Math.random() * 10000),
                f: parseInt(Math.random() * 10000),
                g: parseInt(Math.random() * 10000)
            };
        });
        res.end(JSON.stringify({ data: arr, total: arr.length }));
    }

    if (url.parse(req.url).pathname == "/getComponent") {
        const query = qs.parse(url.parse(req.url).query);
        const comName = getRouteCompName(query.key);
        let dir = fs.readdirSync(path.resolve("./src/components/basic")).filter(v => /^c/.test(v));
        dir = dir.map(v => {
            const cfg = getComCfg(v);
            return {
                label: cfg?.name,
                value: v,
                config: cfg
            };
        });
        res.end(JSON.stringify({ comName, dir: dir }));
    }

    if (req.method == "OPTIONS") {
        res.writeHead(200);
        res.end("");
        return;
    }

    if (req.url == "/initPage") {
        let data = "";
        req.on("data", chunk => {
            data += chunk;
        });
        req.on("end", () => {
            console.log(data);
            data = JSON.parse(decodeURI(data));
            astRoute(data.key, {
                component: template.ast(`load(() => import("../components/business/${data.coms.fileName}"))`).expression
            });
            initCode(data.coms);
            // 处理文件
            res.end("ok");
        });
    }
}).listen(2326);
