import React from "react";
import { Button } from "antd";
import { Link } from "react-router-dom";
import style from "./index.less";
export default props => {
    const { text, back } = props;
    return (
        <div className={style.box}>
            <img src={require("@images/succ.png")} />
            <p>{text}</p>
            <Link to={back} style={{ marginTop: "30px" }}>
                <Button>返回</Button>
            </Link>
        </div>
    );
};
