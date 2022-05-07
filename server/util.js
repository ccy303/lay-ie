const fs = require("fs-extra");
const parser = require("@babel/parser");
const path = require("path");
const t = require("@babel/types");
const generator = require("@babel/generator").default;
const { v5 } = require("uuid");
const traverse = require("@babel/traverse").default;
const prettier = require("prettier");

//复制路由
const getRouteString = () => {
	const ast = parser.parse(fs.readFileSync(path.resolve("./src/routes/index.js"), "utf-8"), { sourceType: "module", plugins: ["jsx"] });
	traverse(ast, {
		ObjectProperty: (content) => {
			if (content.node.key.name == "component") {
				content.node.value = t.stringLiteral(encodeURI(generator(content.node.value).code));
			}
			if (content.node.key.name == "layout") {
				content.node.value = t.stringLiteral(content.node.value.name);
			}
		},
	});
	const target = ast.program.body.find((v) => {
		return v.type == "VariableDeclaration" && v.declarations[0].init.type == "ArrayExpression";
	});
	return generator(target.declarations[0].init).code;
};

// 查找route
const findRoute = (key, router) => {
	const _router = router || eval(getRouteString());
	let target = null;
	for (let i = 0; i < _router.length; i++) {
		if (_router[i].children) {
			target = findRoute(key, _router[i].children);
		} else {
			if (v5(`${_router[i].title}${_router[i].path}`, v5.URL) == key) {
				target = _router[i];
				break;
			}
		}
	}
	return target;
};

// 查找路由组件路径名称
const getRouteCompName = (key) => {
	const route = findRoute(key);
	let path = "";
	if (route.component) {
		path = decodeURI(route.component).match(/\/([a-zA-z0-9\/])*/)[0];
	}
	return path.split("/").slice(-1)[0] || null;
};

// 修改route属性
const astRoute = (id, values = {}) => {
	const ast = parser.parse(fs.readFileSync(path.resolve("./src/routes/index.js"), "utf-8"), { sourceType: "module", plugins: ["jsx"] });
	traverse(ast, {
		VariableDeclaration: (content) => {
			if (content.node.declarations[0].id.name == "routes") {
				content.traverse({
					// 对象
					ObjectExpression: (objAst) => {
						const pt = {
							path: "",
							title: "",
						};
						// 对象属性循环
						objAst.node.properties.forEach((v) => {
							if (v.key.name == "title" || v.key.name == "path") {
								pt[v.key.name] = v.value.value;
							}
						});
						if (id == v5(`${pt.title}${pt.path}`, v5.URL)) {
							objAst.traverse({
								// 对象属性遍历器
								ObjectProperty: (property) => {
									if (values[property.node.key.name]) {
										property.node.value = values[property.node.key.name];
									}
								},
							});
						}
					},
				});
			}
		},
	});
	fs.writeFileSync(path.resolve("./src/routes/index.js"), prettier.format(generator(ast).code));
};

// 根据组件名称生成代码文件
const initCode = (coms, path) => {
	console.log(coms, path);
};

module.exports = {
	getRouteString,
	astRoute,
	findRoute,
	getRouteCompName,
	initCode,
};
