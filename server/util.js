const fs = require("fs-extra");
const parser = require("@babel/parser");
const path = require("path");
const t = require("@babel/types");
const generator = require("@babel/generator").default;
const { v5 } = require("uuid");
const traverse = require("@babel/traverse").default;
const prettier = require("prettier");
const template = require("@babel/template").default;

//复制路由
const getRouteString = () => {
    const ast = parser.parse(fs.readFileSync(path.resolve("./src/routes/index.js"), "utf-8"), {
        sourceType: "module",
        plugins: ["jsx"]
    });
    traverse(ast, {
        ObjectProperty: content => {
            if (content.node.key.name == "component") {
                content.node.value = t.stringLiteral(encodeURI(generator(content.node.value).code));
            }
            if (content.node.key.name == "layout") {
                content.node.value = t.stringLiteral(content.node.value.name);
            }
        }
    });
    const target = ast.program.body.find(v => {
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
const getRouteCompName = key => {
    const route = findRoute(key);
    let path = "";
    if (route.component) {
        path = decodeURI(route.component).match(/\/([a-zA-z0-9\/])*/)[0];
    }
    return path.split("/").slice(-1)[0] || null;
};

// 修改route属性
const astRoute = (id, values = {}) => {
    const ast = parser.parse(fs.readFileSync(path.resolve("./src/routes/index.js"), "utf-8"), {
        sourceType: "module",
        plugins: ["jsx"]
    });
    traverse(ast, {
        VariableDeclaration: content => {
            if (content.node.declarations[0].id.name == "routes") {
                content.traverse({
                    // 对象
                    ObjectExpression: objAst => {
                        const pt = {
                            path: "",
                            title: ""
                        };
                        // 对象属性循环
                        objAst.node.properties.forEach(v => {
                            if (v.key.name == "title" || v.key.name == "path") {
                                pt[v.key.name] = v.value.value;
                            }
                        });
                        if (id == v5(`${pt.title}${pt.path}`, v5.URL)) {
                            objAst.traverse({
                                // 对象属性遍历器
                                ObjectProperty: property => {
                                    if (values[property.node.key.name]) {
                                        property.node.value = values[property.node.key.name];
                                    }
                                }
                            });
                        }
                    }
                });
            }
        }
    });
    fs.writeFileSync(path.resolve("./src/routes/index.js"), prettier.format(generator(ast).code));
};

// 根据组件名称生成代码文件
const initCode = ({ coms, fileName, cfgs }) => {
    const fileAst = t.file(t.program([]));
    fileAst.program.body.push(template.ast(`import React from 'react'`));
    const _coms = Array.from(new Set(coms));
    for (let i = 0, item; (item = _coms[i++]); ) {
        fileAst.program.body.push(template.ast(`import ${item.replace(/^[a-zA-z]/, $1 => $1?.toUpperCase())} from '@base/${item}'`));
    }

    const cfgArr = cfgs.map((v, i) => `const ${coms[i]}_${i}_cfg = ${JSON.stringify(v)}`);

    const comsCode = coms.map((v, i) => `<${v.replace(/^[a-zA-z]/, $1 => $1?.toUpperCase())} {...${v}_${i}_cfg} />`);
    fileAst.program.body.push(
        template.ast(
            `
						export default props => {
							${cfgArr.join(";")}
							return <>
								${comsCode.join("")}
							</>;
						}	
				`,
            { plugins: ["jsx"] }
        )
    );

    fs.writeFileSync(path.resolve(`./src/components/business/${fileName}/index.js`), prettier.format(generator(fileAst).code));
};

// 获取组件配置
const getComCfg = name => {
    let cfg = null;
    try {
        cfg = fs.readFileSync(path.resolve(`./src/components/basic/${name}/config.json`), "utf-8");
    } catch (err) {}
    return cfg ? JSON.parse(cfg) : null;
};

// AST重写App.js
const traverseApp = () => {
    const ast = parser.parse(fs.readFileSync(path.resolve("./server/.code/src/App.js"), "utf-8"), { sourceType: "module", plugins: ["jsx"] });
    traverse(ast, {
        JSXOpeningElement: path => {
            if (path.node.name.name == "PermissionRoute") {
                path.node.attributes = [t.jsxAttribute(t.jsxIdentifier("DESIGN"), t.jsxExpressionContainer(t.booleanLiteral(true)))];
            }
        },
        ImportDeclaration: _path => {
            if (_path.node.specifiers[0]?.local.name == "PermissionRoute") {
                _path.node.source.value = path.resolve("./src/routes/PermissionRoute");
            }
        }
    });
    fs.writeFileSync(path.resolve("./server/.code/src/App.js"), generator(ast).code);
};

// AST重写Index.js
const traverseIndex = () => {
    const ast = parser.parse(fs.readFileSync(path.resolve("./server/.code/src/index.js"), "utf-8"), { sourceType: "module", plugins: ["jsx"] });
    traverse(ast, {
        ImportDeclaration: path => {
            if (path.node.source.value == "@src/App") {
                path.node.source.value = "./App";
            }
        }
    });
    fs.writeFileSync(path.resolve("./server/.code/src/index.js"), generator(ast).code);
};

// 注入index.js
const injectIndex = file => {
    const clickFun = `const handel = () => {
        CModal.confirm({
            title: "页面配置",
            content: <div style={{ minHeight: "600px" }}>
                <iframe width="100%" height="600px" src={'http://localhost:2325/design.html?t=' + new Date().getTime()}></iframe>
            </div>,
            width: 1200,
            onOk: () => {
                console.log(234567);
            },
        });
    }`;

    const runFun = `ReactDOM.render(
      <ConfigProvider locale={zhCN} prefixCls='linkfin'>
          <App />
          <div
              style={{
                  position: "fixed",
                  bottom: "20px",
                  right: "30px",
                  width: "30px",
                  height: "30px",
                  cursor: "pointer",
              }}
              onClick={handel}
          >
              <SettingTwoTone style={{ fontSize: "30px" }} />
          </div>
      </ConfigProvider>,
      document.getElementById("root")
    );`;

    const wepInput = fs.readFileSync(file, "utf-8");
    const ast = parser.parse(wepInput, { sourceType: "module", plugins: ["jsx"] });
    // 处理配置按钮
    ast.program.body.unshift(t.importDeclaration([t.importSpecifier(t.identifier("SettingTwoTone"), t.identifier("SettingTwoTone"))], t.stringLiteral("@ant-design/icons")));
    ast.program.body.unshift(t.importDeclaration([t.importDefaultSpecifier(t.identifier("CModal"))], t.stringLiteral("@base/cModal")));
    ast.program.body.splice(-1, 0, parser.parse(clickFun, { sourceType: "module", plugins: ["jsx"] }).program.body[0]);
    ast.program.body[ast.program.body.length - 1] = parser.parse(runFun, { sourceType: "module", plugins: ["jsx"] }).program.body[0];
    traverse(ast, {
        ImportDeclaration: _path => {
            if (_path.node.source.value == "@src/App") {
                _path.node.source.value = path.resolve("./src/App");
            }
        }
    });
    const code = prettier.format(generator(ast).code);
    !fs.existsSync(path.resolve("./server/.code/source")) && fs.mkdirSync(path.resolve("./server/.code/source"), { recursive: true });
    fs.writeFileSync(path.resolve("./server/.code/source/index.js"), code);
};

module.exports = {
    getRouteString,
    astRoute,
    findRoute,
    getRouteCompName,
    initCode,
    getComCfg,
    traverseApp,
    traverseIndex,
    injectIndex
};
