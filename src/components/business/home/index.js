import React from "react";
import { Link } from "react-router-dom";
import Header from "@base/header";
import { Layout, Button } from "antd";
import style from "./styles.less";
export default (props) => {
  return (
    <Layout className={style.warp}>
      <Layout.Header className={style.header}>
        <Header {...props} />
      </Layout.Header>
      <Layout>
        <Layout.Content className={style.content}>
          <section>
            <p
              style={{
                fontSize: "30px",
                color: "#fff",
                fontWeight: "bold",
                margin: 0,
                marginBotton: "10px",
              }}
            >
              金服管理后台脚手架3.0
            </p>
            <p
              style={{
                marginBotton: "10px",
                color: "#fff",
                fontSize: "20px",
                fontWeight: "bolder",
                textAlign: "center",
              }}
            >
              0搭建，开发即需求
            </p>
            <p style={{ textAlign: "center" }}>
              <Link to="/admin/one">
                <Button type="primary">前往工作台</Button>
              </Link>
            </p>
          </section>
        </Layout.Content>
      </Layout>
    </Layout>
  );
};
