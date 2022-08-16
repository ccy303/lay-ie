import React from "react";
import style from "./styles.less";
import { Link } from "react-router-dom";
import { Observer } from "mobx-react-lite";
import { appConfig } from "@root/appConfig";
const Header = props => {
    const { header } = appConfig;
    const { gStore } = props;
    return (
        <div className={style.warp}>
            <div className={style.left}>
                {header.logo.$$typeof ? (
                    header.logo
                ) : (
                    <a href='/'>
                        <img src={header.logo} className={style.logo} />
                    </a>
                )}
                <span className={style.title}>{header.appTitle}</span>
            </div>
            <Observer>
                {() => (
                    <div className={style.right}>
                        {gStore.g_userInfo ? (
                            <>
                                {header.userInfoDom ? (
                                    <header.userInfoDom {...props} />
                                ) : (
                                    <span>
                                        {gStore.g_userInfo[header.userInfoDataIndex] || "-"}
                                    </span>
                                )}
                                {!!header?.logoutFun && (
                                    <a
                                        onClick={() => header?.logoutFun(props)}
                                        className={style.exit}
                                    >
                                        安全退出
                                    </a>
                                )}
                            </>
                        ) : (
                            <Link className={style.exit} to='/login'>
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
