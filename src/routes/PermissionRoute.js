import React, { useEffect } from "react";
import routes from "./index.js";
import gStore from "@src/store/global";
import { getUser, getEnums } from "@src/http/public";
import NoMatch from "@base/noMatch";
import { checkAuth, getRouteByPath, findRoute } from "@utils/index";
import { useLocalStore, Observer } from "mobx-react-lite";
import cfg from "@root/linkfin.json";
import {
    HashRouter,
    Routes,
    Route,
    useNavigate,
    Outlet,
    useLocation,
    Navigate
} from "react-router-dom";
import { runInAction } from "mobx";
const renderRoute = (routes, design) => {
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
                path = path?.replace(/\//, "");
                const CheckAuth = () => {
                    const location = useLocation();
                    if (!design && logined && !gStore.g_userInfo) {
                        return <Navigate to={`/login?redict_uri=${location.pathname}`} />;
                    }
                    if (!design && !checkAuth(route.auths, gStore.g_userAuth)) {
                        return <Navigate to={`/403`} />;
                    }
                    return (
                        <>
                            <Component gStore={gStore} location={location} />
                        </>
                    );
                };

                if (!children) {
                    if (Layout) {
                        return (
                            <Route
                                key={path}
                                element={
                                    <Layout design={design} targetRoute={route} gStore={gStore} />
                                }
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
                                element={
                                    <Layout design={design} targetRoute={route} gStore={gStore} />
                                }
                            >
                                <Route index element={<NoMatch />} />
                                {renderRoute(children, design)}
                                <Route path='*' element={<NoMatch />} />
                            </Route>
                        );
                    }
                    return (
                        <Route key={path} path={path}>
                            <Route index element={<NoMatch />} />
                            {renderRoute(children, design)}
                            <Route path='*' element={<NoMatch />} />
                        </Route>
                    );
                }
            })}
        </>
    );
};

const PermissionRoute = props => {
    const { DESIGN = false } = props;
    return (
        <HashRouter>
            <Routes>
                <Route path='/' element={<Main DESIGN={DESIGN} />}>
                    {renderRoute(routes, DESIGN)}
                    <Route path='*' element={<NoMatch />} />
                </Route>
            </Routes>
        </HashRouter>
    );
};

const Main = props => {
    const { DESIGN } = props;
    const store = useLocalStore(() => ({
        state: false
    }));
    const location = useLocation();
    const navigate = useNavigate();
    useEffect(() => {
        (async () => {
            try {
                let res = null;
                if (!DESIGN) {
                    const res = await getUser();
                    gStore.g_userInfo = res.userInfo;
                    gStore.g_userAuth = res.auth;
                }
                store.state = true;
                location.pathname === "/" && navigate(cfg.rootPath);
            } catch (err) {
                store.state = true;
                if (err?.response?.status == 405) {
                    navigate(`/403?tp=1`);
                    return;
                }
                let flag = 0;
                // 查找第一个不需要登录的路由
                for (; flag < routes.length; flag++) {
                    const res = getRouteByPath(routes[flag], location.pathname);
                    if (!res) {
                        continue;
                    }
                    if (!res.route.logined) {
                        navigate(location.pathname);
                    } else {
                        // 查找第一个不需要登录就能查看的路由
                        const target = findRoute(
                            routes.filter(v => v.path !== "/login"),
                            "logined",
                            false
                        );
                        navigate(target?.fullPathName || "/login");
                    }
                    break;
                }
                if (flag == routes.length) {
                    navigate("/login");
                }
            }
        })();
    }, []);

    location.pathname === "/" && store.state && navigate(`${cfg.rootPath}?a=12`);
    return <Observer>{() => <>{store.state ? <Outlet /> : <></>}</>}</Observer>;
};

export default PermissionRoute;
