import { v5 as uuidv5 } from "uuid";
import load from "../components/basic/loadable";
import Layout from "../components/basic/layout";
const routes = [
    {
        path: "/login",
        title: "登录",
        menu: false,
        component: load(() => import("../components/business/login"))
    },
    {
        path: "/home",
        title: "一级路由",
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
            },
            {
                title: "二级路由集合",
                menu: true,
                path: "/singlePage",
                logined: true,
                children: [
                    {
                        path: "/page1",
                        title: "form表单",
                        menu: true,
                        component: load(() => import("../components/business/form"))
                    },
                    {
                        path: "/page2",
                        title: "图片",
                        menu: true,
                        component: load(() => import("../components/business/imageColor"))
                    }
                ]
            },
            {
                path: "/multistage",
                title: "三级路由集合",
                menu: true,
                logined: true,
                children: [
                    {
                        path: "/page",
                        title: "二级路由",
                        menu: true,
                        children: [
                            {
                                path: "/page1",
                                title: "三级路由",
                                menu: true,
                                component: load(() => import("../components/business/page1"))
                            }
                        ]
                    }
                ]
            },
            {
                title: "非菜单路由",
                menu: true,
                path: "/noMenuRoute",
                breadcrumb: false,
                logined: true,
                children: [
                    {
                        path: "/page1",
                        title: "列表",
                        menu: true,
                        component: load(() => import("../components/business/list"))
                    },
                    {
                        path: "/page1/:id",
                        title: "二级路由1",
                        activePath: "/admin/noMenuRoute/page1",
                        menu: false,
                        component: load(() => import("../components/business/page1"))
                    }
                ]
            },
            {
                path: "/auth",
                title: "权限路由",
                menu: true,
                logined: true,
                auths: ["auth4", "auth2 & auth3"],
                component: load(() => import("../components/business/home"))
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

const format = (route, reset = { logined: false }) => {
    const _route = {
        breadcrumb: { breadcrumb: true, disabled: !route.component },
        ...reset,
        ...route,
        fullPathName: `${reset.fullPathName || ""}${route.path}`,
        routeId: uuidv5(`${route.title}${route.path}`, uuidv5.URL),
        auths: Array.from(new Set([...(route.auths || []), ...(reset.auths || [])]))
    };

    if (_route.children) {
        for (let i = 0; i < _route.children.length; i++) {
            _route.children[i] = format(_route.children[i], {
                logined: _route.logined || false,
                fullPathName: _route.fullPathName,
                auths: _route.auths
            });
        }
    }

    return _route;
};

export default routes.map(v => format(v));
