const fs = require("fs-extra");
const path = require("path");
const parser = require("@babel/parser");
const t = require("@babel/types");
const generator = require("@babel/generator").default;
const template = require("@babel/template").default;
const traverse = require("@babel/traverse").default;

const traverseApp = () => {
    const ast = parser.parse(fs.readFileSync(path.resolve("./server/.code/src/App.js"), "utf-8"), { sourceType: "module", plugins: ["jsx"] });
    traverse(ast, {
        JSXOpeningElement: (path) => {
            if (path.node.name.name == "PermissionRoute") {
                path.node.attributes = [t.jsxAttribute(t.jsxIdentifier("DESIGN"), t.jsxExpressionContainer(t.booleanLiteral(true)))];
            }
        },
        ImportDeclaration: (_path) => {
            if (_path.node.specifiers[0]?.local.name == "PermissionRoute") {
                _path.node.source.value = path.resolve("./src/routes/PermissionRoute");
            }
        },
    });
    fs.writeFileSync(path.resolve("./server/.code/src/App.js"), generator(ast).code);
};

const traverseIndex = () => {
    const ast = parser.parse(fs.readFileSync(path.resolve("./server/.code/src/index.js"), "utf-8"), { sourceType: "module", plugins: ["jsx"] });
    traverse(ast, {
        ImportDeclaration: (path) => {
            if (path.node.source.value == "@src/App") {
                path.node.source.value = "./App";
            }
        },
    });
    fs.writeFileSync(path.resolve("./server/.code/src/index.js"), generator(ast).code);
};

module.exports = () => {
    // 复制文件
    if (!fs.existsSync(path.resolve("./server/.code/src"))) {
        fs.mkdirSync(path.resolve("./server/.code/src"), { recursive: true });
    }
    fs.copySync(path.resolve("./src/index.js"), path.resolve("./server/.code/src/index.js"));
    fs.copySync(path.resolve("./src/App.js"), path.resolve("./server/.code/src/App.js"));
    fs.copySync(path.resolve("./src/app.less"), path.resolve("./server/.code/src/app.less"));

    // 处理js
    traverseApp();
    traverseIndex();
};
