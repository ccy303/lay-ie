import React from "react";
import { Message } from "antd";
import Modal from "../cModal";
import Form from "../cForm";
const AddRouter = () => {
    const cfg = {
        cForm: "form",
        submitBtn: false,
        onFinish: () => {
            // console.log(form["form1"].getFieldsValue());
        },
        items: [
            {
                name: "title",
                label: "标题",
                type: "text",
                rules: [{ required: true }],
            },
            {
                name: "component",
                label: "组件路径",
                type: "text",
                rules: [{ required: true }],
            },
            {
                name: "path",
                label: "路由路径",
                type: "text",
                rules: [{ required: true }],
            },
            {
                name: "logined",
                label: "登录可访问",
                type: "switch",
                rules: [{ required: true }],
            },
            {
                name: "menu",
                label: "菜单是否显示",
                type: "switch",
                rules: [{ required: true }],
            },
        ],
    };
    Modal.confirm({
        title: "路由添加",
        onOk: async () => {
            Message.warning("功能暂不可用！");
            return false;
        },
        content: (
            <>
                <Form {...cfg} />
            </>
        ),
    });
};

export { AddRouter };
