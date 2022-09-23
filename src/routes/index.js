import { v5 as uuidv5 } from "uuid";
import load from "../components/basic/loadable";
import Layout from "../components/basic/layout";
import gStore from "@src/store/global.js";
import { toJS } from "mobx";

const routes = [
    // {
    //     path: "/login",
    //     title: "登录",
    //     menu: false,
    //     component: load(() => import("../components/business/login"))
    // },
    // {
    //     path: "/home",
    //     title: "首页",
    //     menu: false,
    //     component: load(() => import("../components/business/home"))
    // },
    // {
    //     title: "工作台",
    //     menu: false,
    //     path: "/admin",
    //     logined: true,
    //     layout: Layout,
    //     breadcrumb: false,
    //     children: [
    //         {
    //             path: "/one",
    //             title: "一级路由",
    //             menu: true,
    //             logined: true,
    //             component: load(() => import("../components/business/pageIndex")),
    //             breadcrumb: [
    //                 {
    //                     path: "",
    //                     title: "空连接"
    //                 },
    //                 {
    //                     path: "http://www.baidu.com",
    //                     title: "禁用链接"
    //                 },
    //                 {
    //                     path: "http://www.baidu.com",
    //                     title: "外部链接-百度(新窗口打开)",
    //                     target: "_block"
    //                 },
    //                 {
    //                     path: "http://www.douyu.com",
    //                     title: "外部链接-斗鱼"
    //                 },
    //                 {
    //                     path: "/home",
    //                     title: "内部链接"
    //                 }
    //             ]
    //         }
    //     ]
    // },
    // {
    //     title: "403",
    //     menu: false,
    //     path: "/403",
    //     layout: Layout,
    //     component: load(() => import("../components/basic/noAuth"))
    // }
];

export default routes;
