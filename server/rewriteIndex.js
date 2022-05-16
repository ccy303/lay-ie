const fs = require("fs-extra");
const parser = require("@babel/parser");
const path = require("path");
const t = require("@babel/types");
const generator = require("@babel/generator").default;
const traverse = require("@babel/traverse").default;
const prettier = require("prettier");

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

module.exports = file => {
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

    if (!fs.existsSync(path.resolve("./server/.code/source"))) {
        fs.mkdirSync(path.resolve("./server/.code/source"), { recursive: true });
    }
    fs.writeFileSync(path.resolve("./server/.code/source/index.js"), code);
};
