import React from "react";
import { Link } from "react-router-dom";
import { Button } from "antd";
import style from "./styles.less";

const NoMatch = (props) => {
  return (
    <div className={style.wrap}>
      <span className={style["first-title"]}>404</span>
      <span className={style["second-title"]}>您当前访问的页面不存在</span>
      <Link to="/">
        <Button type="primary" style={{ margin: "10px 0 0 0" }}>
          返回首页
        </Button>
      </Link>
    </div>
  );
};

export default NoMatch;
