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
    fs.copySync(path.resolve("./src"), path.resolve("./server/.code/src"));

    // 处理js
    traverseApp();
    traverseIndex();

    // const dir = fs.readdirSync(path.resolve("./src/components/basic")).filter((v) => /^c/.test(v));

    // const astImport = template(`import %%name%% from %%path%%`);

    // const file = t.file(t.program([]));
    // // 依赖引入
    // file.program.body.push(
    //     astImport({
    //         name: "React",
    //         path: `react`,
    //     })
    // );

    // for (let i = 0, _dir; (_dir = dir[i++]); ) {
    //     file.program.body.push(
    //         astImport({
    //             name: _dir.replace(/^c/, ($1) => $1.toUpperCase()),
    //             path: `@base/${_dir}`,
    //         })
    //     );
    // }

    // // jsx
    // const astJsx = t.jsxElement(t.jsxOpeningElement(t.jsxIdentifier("div"), []), t.jsxClosingElement(t.jsxIdentifier("div")), []);

    // // function
    // const astFunc = t.arrowFunctionExpression([t.identifier("props")], t.blockStatement([t.returnStatement(astJsx)]));

    // // export 语句
    // const astExport = t.exportDefaultDeclaration(astFunc);

    // file.program.body.push(astExport);

    // console.log(generator(file).code);
};
