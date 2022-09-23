import React, { useEffect } from "react";
import RouteClass from "@utils/route";
import gStore from "@src/store/global";
import NoMatch from "@base/noMatch";
import { checkAuth } from "@utils/index";
import { useLocalStore, Observer } from "mobx-react-lite";
import { toJS } from "mobx";
import { HashRouter, Routes, Route, Outlet, useLocation, Navigate } from "react-router-dom";

import { useDrop } from "react-dnd";

const DropContainer = props => {
    const [{ canDrop, isOver }, drop] = useDrop(() => ({
        accept: "compoment",
        drop: () => ({ name: "test" }),
        collect: monitor => {
            console.log(monitor);
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
                    children,
                    logined
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
                    if (Layout) {
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
                    if (Layout) {
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
                    const route = new RouteClass(gStore.g_config.router);
                    route.initRouteAttribute();

                    return (
                        <Routes>
                            <Route path='/' element={<Main />}>
                                {renderRoute(route.initLayout())}
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
