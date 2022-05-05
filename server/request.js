const http = require("http");
const url = require("url");
const fs = require("fs");
const path = require("path");
const qs = require("qs");
http.createServer((req, res) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
	res.setHeader("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
	res.setHeader("Content-Type", "application/json;charset=utf-8");
	if (req.url == "/addRouter") {
		res.end(true);
	}
	if (url.parse(req.url).pathname == "/getComponent") {
		const query = qs.parse(url.parse(req.url).query);

		let dir = fs.readdirSync(path.resolve("./src/components/basic")).filter((v) => /^c/.test(v));
		dir = dir.map((v) => {
			return {
				label: v,
				value: v,
				config: true,
			};
		});
		res.end(JSON.stringify(dir));
	}

	if (req.method == "OPTIONS") {
		res.writeHead(200);
		res.end("");
		return;
	}

	if (req.url == "/initPage") {
		let data = "";
		req.on("data", (chunk) => {
			data += chunk;
		});
		req.on("end", () => {
			data = decodeURI(data);
			console.log(data);
			// 处理文件
			res.end(data);
		});
	}
}).listen(2326);
