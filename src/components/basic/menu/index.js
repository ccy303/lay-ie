import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLocalObservable, observer } from "mobx-react-lite";
import { Menu } from "antd";
import routes from "@src/routes";
import { checkAuth, getActiveRoute } from "@utils/index";
import "./styles.less";
const { SubMenu } = Menu;

const getOpenKeys = (path) => {
  const arr = path.split("/").filter((v) => v);
  const out = [];
  for (let i = 1, len = arr.length; i <= len; i++) {
    const slis = arr.slice(0, i);
    out.push(`/${slis.join("/")}`);
  }
  return out;
};

const MenuCom = observer((props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { targetRoute } = props;
  const { g_userAuth, g_userInfo } = props.gStore;
  const store = useLocalObservable(() => ({
    menus: [],
    openKeys: getOpenKeys(location.pathname),
    activeKeys: [`${getActiveRoute(targetRoute, location.pathname)?.path}`],
  }));

  useEffect(() => {
    store.activeKeys = [`${getActiveRoute(targetRoute, location.pathname)?.path}`];
  }, [location]);

  const getMenu = (routes, menu = [], path = "") => {
    routes.forEach((route) => {
      if (route.auths && !checkAuth(route.auths, g_userAuth)) {
        return;
      }
      if (route.logined && !g_userInfo) {
        return;
      }
      if (route.menu) {
        const menuITem = {
          path: `${path}${route.path}`,
          title: route.title,
        };
        if (route.children?.length) {
          menuITem.children = [];
          getMenu(route.children, menuITem.children, menuITem.path);
        }
        menu.push(menuITem);
      } else if (route.children?.length) {
        getMenu(route.children, menu, route.path);
      }
    });
    return menu;
  };

  const onOpenChange = (e) => {
    store.openKeys = Array.from(new Set([...e]));
  };

  const linkTo = (to) => {
    navigate(to);
  };

  const renderMenu = (menus) => {
    return (
      <>
        {menus.map((item, i) => {
          return item.children?.length ? (
            <SubMenu key={item.path} title={<span>{item.title}</span>}>
              {renderMenu(item.children)}
            </SubMenu>
          ) : (
            <Menu.Item key={item.path}>
              <a
                onClick={() => {
                  linkTo(item.path);
                }}
              >
                <span>{item.title}</span>
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
    <Menu
      mode="inline"
      onClick={(e) => {
        store.activeKeys = [e.key];
      }}
      defaultOpenKeys={store.openKeys}
      selectedKeys={store.activeKeys}
      openKeys={store.openKeys}
      onOpenChange={onOpenChange}
    >
      {renderMenu(store.menus)}
    </Menu>
  );
});

export default MenuCom;
