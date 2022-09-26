import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLocalStore, Observer, observer } from "mobx-react-lite";
import { Menu } from "antd";
import gStore from "@src/store/global.js";
import routes from "@src/routes";
import { checkAuth, getRouteByPath } from "@utils/index";
import { AddRouter, pageEdit } from "../design";
import { appConfig } from "@root/appConfig";
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

const MenuCom = observer(props => {
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
        store.activeKeys = `${getRouteByPath(targetRoute, location.pathname)?.path}`;
    }, [location]);

    const getMenu = (routes, menu = [], path = "") => {
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
                    key: route.fullPathName,
                    title: route.title,
                    label: route.title,
                    routeid: route.routeid
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
                        key: route.fullPathName,
                        title: route.title,
                        label: route.title,
                        routeid: route.routeid
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

    useEffect(() => {
        store.menus = getMenu(gStore.g_config.router);
    }, []);

    return (
        <div className={style[`menu-${appConfig.sliderTheme || "light"}`]}>
            <Observer>
                {() => {
                    return (
                        <Menu
                            mode='inline'
                            theme={appConfig.sliderTheme || "light"}
                            onClick={e => {
                                navigate(e.key);
                                store.activeKeys = e.key;
                            }}
                            defaultOpenKeys={store.openKeys}
                            defaultSelectedKeys={[store.activeKeys]}
                            selectedKeys={[store.activeKeys]}
                            openKeys={store.openKeys}
                            onOpenChange={onOpenChange}
                            id={appConfig.sliderTheme || "light"}
                            items={store.menus}
                        />
                    );
                }}
            </Observer>
        </div>
    );
});

export default MenuCom;
