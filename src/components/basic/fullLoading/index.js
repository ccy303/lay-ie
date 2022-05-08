import React from "react";
import { Spin } from "antd";
import ReactDOM from "react-dom";
const Loading = {};
Loading.dom = null;
Loading.show = function (text = "") {
    this.dom = document.createElement("div");
    this.dom.setAttribute(
        "style",
        `
          position: fixed;
          z-index: 10003;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(64, 55, 55, 0.1);
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          margin: auto
        `
    );
    document.body.appendChild(this.dom);
    ReactDOM.render(<Spin tip={text} indicatorType='dot' size='large' spinning={true} />, this.dom);
};
Loading.close = function () {
    if (typeof this.dom.remove === "function") {
        this.dom.remove();
    } else {
        this.dom.parentNode.removeChild(this.dom);
    }
};

export default Loading;
