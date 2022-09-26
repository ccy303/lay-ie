import React from "react";
import gStore from "@src/store/global.js";
import { Observer } from "mobx-react-lite";
import { toJS, runInAction } from "mobx";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import CModal from "@base/cModal";
import CForm from "@base/cForm";
import { Tree } from "antd";
import Route from "@utils/route";
import style from "./index.less";

export default () => {
    const addRoute = data => {
        const route = new Route(toJS(gStore.g_config.router));
        const form = CForm.cUseForm();
        const config = {
            cForm: "routeAdd",
            submitBtn: false,
            labelCol: { span: 10 },
            wrapperCol: { span: 12 },
            initialValues: {
                // 当父节点有layout后子节点无需layout
                layout: data.layout || true,
                menu: true,
                logined: true
            },
            items: [
                [
                    {
                        name: "path",
                        label: "页面路径",
                        type: "text",
                        rules: [
                            { required: true, message: "请输入页面路径" },
                            {
                                validator: (_, val) => {
                                    const res = route.getRouteByKey(val);
                                    if (res) {
                                        return Promise.reject(`存在重复页面路径${val}`);
                                    }
                                    return Promise.resolve();
                                }
                            }
                        ]
                    },
                    {
                        name: "name",
                        label: "页面名称",
                        type: "text",
                        rules: [{ required: true, message: "请输入页面名称" }]
                    }
                ],
                [
                    {
                        name: "layout",
                        label: "页面类型",
                        type: "radio",
                        rules: [{ required: true, message: "请选择页面类型" }],
                        props: {
                            // layout 只能在父节点指定
                            disabled: data.key != "root",
                            options: [
                                { value: true, label: "后台型" },
                                { value: false, label: "前台型" }
                            ]
                        }
                    },
                    {
                        name: "menu",
                        label: "是否需要导航菜单",
                        type: "radio",
                        rules: [{ required: true, message: "请选择是否需要导航菜单" }],
                        props: {
                            options: [
                                { value: true, label: "需要" },
                                { value: false, label: "不需要" }
                            ]
                        }
                    }
                ],
                [
                    {
                        name: "logined",
                        label: "是否登录后可访问",
                        type: "radio",
                        rules: [{ required: true, message: "请选择是否登录后可访问" }],
                        props: {
                            options: [
                                { value: true, label: "是" },
                                { value: false, label: "否" }
                            ]
                        }
                    },
                    { dom: <></> }
                ]
            ]
        };

        CModal.confirm({
            title: "添加路由",
            width: 800,
            content: (
                <>
                    <CForm {...config} />
                </>
            ),
            onOk: async () => {
                const res = await form.routeAdd.validateFields();
                if (data.key == "root") {
                    route.pushChildRouteByKey({
                        ...res,
                        title: res.name,
                        key: res.path,
                        path: /^\//.test(res.path) ? res.path : `/${res.path}`
                    });
                } else {
                    route.pushChildRouteByKey(
                        {
                            ...res,
                            title: res.name,
                            key: res.path,
                            path: /^\//.test(res.path) ? res.path : `/${res.path}`
                        },
                        data.key
                    );
                }
                route.initRouteAttribute();
                runInAction(() => {
                    gStore.g_config.router = route.routes;
                    gStore.g_config.reouteTreeReloadKey = Math.random();
                });
            }
        });
    };

    const minusRoute = data => {};

    return (
        <Observer>
            {() => {
                return (
                    <>
                        <Tree
                            key={gStore.g_config.reouteTreeReloadKey}
                            style={{ width: "100%" }}
                            showLine={true}
                            showIcon={true}
                            treeData={[
                                {
                                    title: "根目录",
                                    key: "root",
                                    path: "/",
                                    children: [...gStore.g_config.router]
                                }
                            ]}
                            selectable={false}
                            defaultExpandAll={true}
                            titleRender={data => {
                                return (
                                    <div className={style.row}>
                                        {data.key == "root" || data.children?.length ? (
                                            data.title
                                        ) : (
                                            <a href={`/#${data.fullPathName || "/"}`}>
                                                {data.title}
                                            </a>
                                        )}
                                        <div>
                                            {(data.layout || data.key == "root") && (
                                                <span
                                                    className={style["plus"]}
                                                    onClick={() => addRoute(data)}
                                                >
                                                    <PlusOutlined />
                                                </span>
                                            )}
                                            {data.key != "root" && (
                                                <span
                                                    className={style["minus"]}
                                                    onClick={() => minusRoute(data)}
                                                >
                                                    <MinusOutlined />
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            }}
                        />
                    </>
                );
            }}
        </Observer>
    );
};
