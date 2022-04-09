import React from "react";
import style from "./styles.less";
import { Link } from "react-router-dom";
import { Observer } from "mobx-react-lite";
const Header = (props) => {
  return (
    <div className={style.warp}>
      <div className={style.left}>
        <Link to="/">
          <img src={require("@images/logo_dx.png")} className={style.logo} />
        </Link>
        <span className={style.title}>金服管理后台脚手架3.0</span>
      </div>
      <Observer>
        {() => (
          <div className={style.right}>
            {props.gStore.g_userInfo ? (
              <span>
                <span>{props.gStore.g_userInfo.phone}</span>
                <a className={style.exit}>安全退出</a>
              </span>
            ) : (
              <Link className={style.exit} to="/login">
                登录
              </Link>
            )}
          </div>
        )}
      </Observer>
    </div>
  );
};

export default Header;
