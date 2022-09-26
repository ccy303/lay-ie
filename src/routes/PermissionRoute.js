import React, { useEffect } from "react";
import RouteClass from "@utils/route";
import gStore from "@src/store/global";
import NoMatch from "@base/noMatch";
import { checkAuth } from "@utils/index";
import { useLocalStore, Observer } from "mobx-react-lite";
import { toJS } from "mobx";
import { HashRouter, Routes, Route, Outlet, useLocation, Navigate } from "react-router-dom";

import { useDrop } from "react-dnd";

import load from "../components/basic/loadable";
import Layout from "../components/basic/layout";

const a = [
    {
        path: "/login",
        title: "登录",
        menu: false,
        component: load(() => import("../components/business/login"))
    },
    {
        path: "/home",
        title: "首页",
        menu: false,
        component: load(() => import("../components/business/home"))
    },
    {
        title: "工作台",
        menu: false,
        path: "/admin",
        logined: true,
        layout: Layout,
        breadcrumb: false,
        children: [
            {
                path: "/one",
                title: "一级路由",
                menu: true,
                logined: true,
                component: load(() => import("../components/business/pageIndex")),
                breadcrumb: [
                    {
                        path: "",
                        title: "空连接"
                    },
                    {
                        path: "http://www.baidu.com",
                        title: "禁用链接"
                    },
                    {
                        path: "http://www.baidu.com",
                        title: "外部链接-百度(新窗口打开)",
                        target: "_block"
                    },
                    {
                        path: "http://www.douyu.com",
                        title: "外部链接-斗鱼"
                    },
                    {
                        path: "/home",
                        title: "内部链接"
                    }
                ]
            }
        ]
    },
    {
        title: "403",
        menu: false,
        path: "/403",
        layout: Layout,
        component: load(() => import("../components/basic/noAuth"))
    }
];

const DropContainer = props => {
    const [{ canDrop, isOver }, drop] = useDrop(() => ({
        accept: "compoment",
        drop: () => ({ name: "test" }),
        collect: monitor => {
            return {
                isOver: monitor.isOver(),
                canDrop: monitor.canDrop()
            };
        }
    }));
    const isActive = canDrop && isOver;

    return (
        <div
            style={{ border: isActive ? "1px dashed #000" : "", height: "100%" }}
            ref={drop}
            data-testid='test'
        >
            {props.children}
        </div>
    );
};

const renderRoute = routes => {
    return (
        <>
            {routes.map(route => {
                const {
                    layout: Layout,
                    component: Component = () => {
                        return <></>;
                    },
                    children
                } = route;

                let { path } = route;
                path = path.replace(/\//, "");
                const CheckAuth = () => {
                    return (
                        <DropContainer>
                            <Component gStore={gStore} location={location} />
                        </DropContainer>
                    );
                };
                if (!children) {
                    if (Layout && typeof Layout == "function") {
                        return (
                            <Route
                                key={path}
                                element={<Layout targetRoute={route} gStore={gStore} />}
                            >
                                <Route path={path} element={<CheckAuth />} />
                            </Route>
                        );
                    }
                    return <Route key={path} path={path} element={<CheckAuth />} />;
                } else {
                    if (Layout && typeof Layout == "function") {
                        return (
                            <Route
                                key={path}
                                path={path}
                                element={<Layout targetRoute={route} gStore={gStore} />}
                            >
                                <Route index element={<NoMatch />} />
                                {renderRoute(children)}
                                <Route path='*' element={<NoMatch />} />
                            </Route>
                        );
                    }
                    return (
                        <Route key={path} path={path}>
                            <Route index element={<NoMatch />} />
                            {renderRoute(children)}
                            <Route path='*' element={<NoMatch />} />
                        </Route>
                    );
                }
            })}
        </>
    );
};

const PermissionRoute = props => {
    return (
        <HashRouter>
            <Observer>
                {() => {
                    const route = new RouteClass(toJS(gStore.g_config.router))
                        .initRouteAttribute()
                        .initLayout()
                        .initCompoment();
                    return (
                        <Routes key={gStore.reouteTreeReloadKey}>
                            <Route path='/' element={<Main />}>
                                {renderRoute(route.routes)}
                                <Route path='*' element={<NoMatch />} />
                            </Route>
                        </Routes>
                    );
                }}
            </Observer>
        </HashRouter>
    );
};

const Main = props => {
    return <Outlet />;
};

export default PermissionRoute;
