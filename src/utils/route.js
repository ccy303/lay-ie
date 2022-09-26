import { copy } from "copy-anything";
import { v5 as uuidv5 } from "uuid";
import React from "react";
import Layout from "../components/basic/layout";

const DefaultCompoment = () => {
    return <div>1234</div>;
};

class Route {
    constructor(routes) {
        this.routes = copy(routes);
    }

    // 初始话route属性
    initRouteAttribute(reset = { logined: false }, route = this.routes, flag = true) {
        route = route.map(v => {
            const _route = {
                breadcrumb: { breadcrumb: true, disabled: !route.component },
                ...reset,
                ...v,
                fullPathName: `${reset.fullPathName == "/" ? "" : reset.fullPathName || ""}${
                    v.path
                }`,
                routeId: uuidv5(`${v.title}${v.path}`, uuidv5.URL),
                auths: Array.from(new Set([...(v.auths || []), ...(reset.auths || [])]))
            };
            if (_route.children) {
                _route.children = this.initRouteAttribute(
                    {
                        logined: _route.logined || false,
                        fullPathName: _route.fullPathName,
                        auths: _route.auths
                    },
                    _route.children,
                    false
                );
            }
            return _route;
        });
        if (flag) {
            this.routes = route;
            return this;
        } else {
            return route;
        }
    }

    // 向route tree 中 key 命中的路由添加子路由
    pushChildRouteByKey(childRoute, key, routes = this.routes, flag = true) {
        if (!key) {
            routes.push(childRoute);
        } else {
            for (let i = 0, len = routes.length; i < len; i++) {
                if (routes[i].key == key) {
                    if (!routes[i].children) {
                        routes[i].children = [];
                    }
                    routes[i].children.push(childRoute);
                    break;
                } else if (routes[i].children) {
                    routes[i].children = this.pushChildRouteByKey(
                        childRoute,
                        key,
                        routes[i].children,
                        false
                    );
                }
            }
        }
        if (flag) {
            this.routes = routes;
            return this;
        } else {
            return routes;
        }
    }

    // 根据key寻找route树节点
    getRouteByKey(key, routes = this.routes) {
        let out = null;
        const tree = routes;
        for (let i = 0, len = tree.length; i < len; i++) {
            if (tree[i].key == key) {
                out = tree[i];
                break;
            } else if (tree[i].children) {
                out = this.getRouteByKey(key, tree[i].children);
            }
        }
        return out;
    }

    // 初始化layout
    initLayout() {
        this.routes = this.routes.map(v => {
            if (v.layout) {
                v.layout = Layout;
            }
            return v;
        });
        return this;
    }

    // 初始化路由组件
    initCompoment(route = this.routes, flag = true) {
        route = route.map(v => {
            if (v.children) {
                v.children = this.initCompoment(v.children, false);
            } else {
                v.component = DefaultCompoment;
            }
            return v;
        });
        if (flag) {
            return this;
        } else {
            return route;
        }
    }
}

export default Route;
