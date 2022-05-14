import React from "react";
import ReactDOM from "react-dom";
import { ConfigProvider } from "antd";
import zhCN from "antd/lib/locale/zh_CN";
import App from "@src/App";

ConfigProvider.config({
    prefixCls: "linkfin"
});

ReactDOM.render(
    <ConfigProvider locale={zhCN} prefixCls='linkfin'>
        <App />
    </ConfigProvider>,
    document.getElementById("root")
);
