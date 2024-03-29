import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLocalStore, Observer } from "mobx-react-lite";
import { Menu } from "antd";
import routes from "@src/routes";
import { checkAuth, getActiveRoute } from "@utils/index";
import { PlusCircleTwoTone } from "@ant-design/icons";
import { AddRouter, pageEdit } from "../design";
import style from "./styles.less";
const { SubMenu } = Menu;

const getOpenKeys = path => {
    const arr = path.split("/").filter(v => v);
    const out = [];
    for (let i = 1, len = arr.length; i <= len; i++) {
        const slis = arr.slice(0, i);
        out.push(`/${slis.join("/")}`);
    }
    return out;
};

const MenuCom = props => {
    const { design } = props;
    const location = useLocation();
    const navigate = useNavigate();
    const { targetRoute } = props;
    const { g_userAuth, g_userInfo } = props.gStore;
    const store = useLocalStore(() => ({
        menus: [],
        openKeys: getOpenKeys(location.pathname),
        activeKeys: ""
    }));

    const routeHandle = async (e, key) => {
        e.preventDefault();
        AddRouter();
    };

    const pageHandle = async id => {
        pageEdit(id);
    };

    useEffect(() => {
        store.activeKeys = `${getActiveRoute(targetRoute, location.pathname)?.path}`;
    }, [location]);

    const getMenu = (routes, menu = [], path = "") => {
        console.log(routes);
        routes.forEach(route => {
            if (!design && route.auths && !checkAuth(route.auths, g_userAuth)) {
                return;
            }
            if (!design && route.logined && !g_userInfo) {
                return;
            }

            if (design) {
                const menuITem = {
                    path: route.fullPathName,
                    title: route.title,
                    routeId: route.routeId
                };
                if (route.children?.length) {
                    menuITem.children = [];
                    getMenu(route.children, menuITem.children, menuITem.path);
                }
                menu.push(menuITem);
            } else {
                if (route.menu) {
                    const menuITem = {
                        path: route.fullPathName,
                        title: route.title,
                        routeId: route.routeId
                    };
                    if (route.children?.length) {
                        menuITem.children = [];
                        getMenu(route.children, menuITem.children, menuITem.path);
                    }
                    menu.push(menuITem);
                } else if (route.children?.length) {
                    getMenu(route.children, menu, route.path);
                }
            }
        });
        return menu;
    };

    const onOpenChange = e => {
        store.openKeys = Array.from(new Set([...e]));
    };

    const linkTo = to => {
        navigate(to);
    };

    const renderMenu = menus => {
        return (
            <>
                {menus.map((item, i, arr) => {
                    return item.children?.length ? (
                        <SubMenu key={item.path} title={<span>{item.title}</span>}>
                            {renderMenu(item.children)}
                            {design && (
                                <Menu.Item key={item.title}>
                                    <a className={style["add-router"]} onClick={e => routeHandle(e, item.title)}>
                                        <PlusCircleTwoTone style={{ marginRight: "5px" }} />
                                        添加路由
                                    </a>
                                </Menu.Item>
                            )}
                        </SubMenu>
                    ) : (
                        <Menu.Item key={item.path}>
                            <a
                                onClick={() => {
                                    linkTo(item.path);
                                }}
                            >
                                <span className={style["link"]}>
                                    {item.title}
                                    {design && (
                                        <span className={style["edit"]} onClick={() => pageHandle(item.routeId)}>
                                            编辑
                                        </span>
                                    )}
                                </span>
                            </a>
                        </Menu.Item>
                    );
                })}
            </>
        );
    };

    useEffect(() => {
        store.menus = getMenu(routes);
    }, []);

    return (
        <Observer>
            {() => {
                return (
                    <Menu
                        mode='inline'
                        onClick={e => {
                            store.activeKeys = e.key;
                        }}
                        defaultOpenKeys={store.openKeys}
                        defaultSelectedKeys={[store.activeKeys]}
                        selectedKeys={[store.activeKeys]}
                        openKeys={store.openKeys}
                        onOpenChange={onOpenChange}
                    >
                        {renderMenu(store.menus)}
                        {design && (
                            <Menu.Item key='root'>
                                <a onClick={e => routeHandle(e, "root")} className={style["add-router"]}>
                                    <PlusCircleTwoTone style={{ marginRight: "5px" }} />
                                    添加路由
                                </a>
                            </Menu.Item>
                        )}
                    </Menu>
                );
            }}
        </Observer>
    );
};

export default MenuCom;
