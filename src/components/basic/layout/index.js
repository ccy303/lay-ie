import React, { useEffect } from "react";
import Menu from "../menu";
import { Layout, Breadcrumb, Spin } from "antd";
import { Outlet, useLocation, Link } from "react-router-dom";
import { Observer, useLocalStore, observer } from "mobx-react-lite";
import { getBread, getRouteByPath } from "@utils/index";
import gStore from "@src/store/global";
import cfg from "@root/linkfin.json";
import style from "./styles.less";

const BreadcrumbLink = props => {
    const { path, title, target, disabled } = props.breadcrumb;
    if (/^http/.test(path)) {
        return (
            <a href={path} target={target}>
                {title}
            </a>
        );
    }
    if (!path || disabled) {
        return <>{title}</>;
    }
    return <Link to={path}>{title}</Link>;
};

const SpinC = observer(() => {
    return (
        <>
            {!!gStore.g_loading.visible ? (
                <div className={style.spin}>
                    <Spin spinning={!!gStore.g_loading.visible} tip={gStore.g_loading.text} />
                </div>
            ) : (
                <></>
            )}
        </>
    );
});

const LayoutUI = props => {
    const { targetRoute, gStore } = props;
    const { g_userInfo, g_loading } = gStore;
    const store = useLocalStore(() => ({
        breadcrumb: []
    }));
    const location = useLocation();

    useEffect(() => {
        const custom = getRouteByPath(targetRoute, location.pathname)?.route?.breadcrumb;
        store.breadcrumb = Array.isArray(custom)
            ? custom
            : getBread(targetRoute, location.pathname);
    }, [location]);

    useEffect(() => {
        !window.__POWERED_BY_QIANKUN__ &&
            (() => {
                const env = {
                    localhost: "http://ft.dev.linkfin.caih.local",
                    ["127.0.0.1"]: "http://ft.dev.linkfin.caih.local",
                    dev: "http://ft.dev.linkfin.caih.local",
                    sit: "http://ft.sit.linkfin.caih.local",
                    uat: "http://ft.uat.linkfin.caih.local",
                    default: "https://ft.caih.com"
                };
                const [match] = window.location.origin.match(
                    /uat|dev|sit|localhost|127\.0\.0\.1/
                ) || ["default"];
                const dom = document.createElement("script");
                dom.src = `${env[match || "default"]}/cdn/header.v1.0.0.js`;
                document.querySelector("head").appendChild(dom);
                dom.onload = () => {
                    window.$ch?.render({
                        title: !g_userInfo
                            ? ""
                            : g_userInfo?.financial
                            ? "金融机构工作台"
                            : "客户工作台",
                        inType: false,
                        orgType: !g_userInfo
                            ? ""
                            : g_userInfo?.financial
                            ? "financialer"
                            : "customer",
                        mobile: g_userInfo?.mobile,
                        logout: () => {
                            window.location.href = `/client/oauth2/logout?logout_success_url=${window.origin}`;
                        }
                    });
                };
            })();
    }, []);

    return (
        <Layout className={style.warp}>
            <Layout.Header id='header' className={style.header}></Layout.Header>
            <Layout>
                <Layout.Sider
                    className={style.sider}
                    style={{
                        backgroundColor: {
                            dark: "#1e1e2d",
                            light: "#fff"
                        }[cfg.sliderTheme]
                    }}
                >
                    <Menu {...props} />
                </Layout.Sider>
                <Layout.Content className={style.content}>
                    <div className={style.breadcrumb}>
                        <Observer>
                            {() => (
                                <Breadcrumb separator='>'>
                                    {[{ title: cfg.menuTitle }, ...store.breadcrumb].map(v => {
                                        return (
                                            <Breadcrumb.Item key={v.title}>
                                                <BreadcrumbLink breadcrumb={v} />
                                            </Breadcrumb.Item>
                                        );
                                    })}
                                </Breadcrumb>
                            )}
                        </Observer>
                    </div>
                    <div className={style.main}>
                        <Outlet />
                    </div>
                </Layout.Content>
            </Layout>
            <SpinC />
        </Layout>
    );
};

export default LayoutUI;
