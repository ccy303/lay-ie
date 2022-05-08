import React from "react";
import CForm from "./../cForm";
import { Table, Button } from "antd";
import style from "./index.less";
export default props => {
    const cForm_0_cfg = {
        submitBtn: false,
        cForm: "23",
        items: [
            {
                label: "关键词",
                name: "132",
                type: "text"
            },
            {
                label: "关键词",
                name: "132",
                type: "text"
            },
            {
                label: "关键词",
                name: "132",
                type: "text"
            },
            {
                label: "关键词",
                name: "132",
                type: "text"
            },
            {
                label: "关键词",
                name: "132",
                type: "text"
            },
            {
                label: "关键词",
                name: "132",
                type: "text"
            },
            {
                label: "关键词",
                name: "132",
                type: "text"
            },
            {
                dom: (
                    <div className={style["btn-groups"]}>
                        <Button className={style["mr-20"]}>重置</Button>
                        <Button type='primary'>搜索</Button>
                    </div>
                )
            }
        ]
    };
    return (
        <div>
            <CForm {...cForm_0_cfg} />
            <Table />
        </div>
    );
};
