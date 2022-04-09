import React, { useEffect } from "react";
import Header from "../header";
import Menu from "../menu";
import { Layout, Breadcrumb } from "antd";
import { Outlet, useLocation, Link } from "react-router-dom";
import { Observer, useLocalObservable } from "mobx-react-lite";
import { getBread, getActiveRoute } from "@utils/index";
import style from "./styles.less";

const BreadcrumbLink = (props) => {
  const { path, title, target } = props.breadcrumb;
  if (/^http/.test(path)) {
    return (
      <a href={path} target={target}>
        {title}
      </a>
    );
  }
  if (!path) {
    return <>{title}</>;
  }
  return <Link to={path}>{title}</Link>;
};

const LayoutUI = (props) => {
  const { targetRoute } = props;
  const store = useLocalObservable(() => ({
    breadcrumb: [],
  }));
  const location = useLocation();
  useEffect(() => {
    const custom = getActiveRoute(targetRoute, location.pathname)?.route?.breadcrumb;
    store.breadcrumb = Array.isArray(custom) ? custom : getBread(targetRoute, location.pathname);
  }, [location]);
  return (
    <Layout className={style.warp}>
      <Layout.Header className={style.header}>
        <Header {...props} />
      </Layout.Header>
      <Layout>
        <Layout.Sider className={style.sider}>
          <Menu {...props} />
        </Layout.Sider>
        <Layout.Content className={style.content}>
          <div className={style.breadcrumb}>
            <Observer>
              {() => (
                <Breadcrumb>
                  {store.breadcrumb.map((v) => {
                    return (
                      <Breadcrumb.Item key={v.title}>
                        <BreadcrumbLink breadcrumb={v} />
                      </Breadcrumb.Item>
                    );
                  })}
                </Breadcrumb>
              )}
            </Observer>
          </div>
          <Outlet />
        </Layout.Content>
      </Layout>
    </Layout>
  );
};

export default LayoutUI;
