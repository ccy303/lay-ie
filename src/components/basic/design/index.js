import React from "react";
import axios from "axios";
import { Message, Button, Select, Row, Col } from "antd";
import { PlusOutlined, ToolTwoTone, MinusCircleOutlined } from "@ant-design/icons";
import Modal from "../cModal";
import CForm, { holderFun } from "../cForm";
import style from "./index.less";

const AddRouter = () => {
    const cfg = {
        cForm: "form",
        submitBtn: false,
        items: [
            {
                name: "title",
                label: "标题",
                type: "text",
                rules: [{ required: true }]
            },
            {
                name: "component",
                label: "组件路径",
                type: "text",
                rules: [{ required: true }]
            },
            {
                name: "path",
                label: "路由路径",
                type: "text",
                rules: [{ required: true }]
            },
            {
                name: "logined",
                label: "登录可访问",
                type: "switch",
                rules: [{ required: true }]
            },
            {
                name: "menu",
                label: "菜单是否显示",
                type: "switch",
                rules: [{ required: true }]
            }
        ]
    };
    Modal.confirm({
        title: "路由添加",
        onOk: async () => {
            Message.warning("功能暂不可用！");
            return false;
        },
        content: (
            <>
                <CForm {...cfg} />
            </>
        )
    });
};

const pageEdit = async key => {
    const { data } = await axios.get(`http://localhost:2326/getComponent?key=${key}`);
    const form = CForm.cUseForm();

    const comCfg = (com, cfg, index) => {
        if (!cfg.cfgs) {
            return Message.warning("该组件无法配置");
        }

        const renderMultipleFormItem = ({ key, name, ...reset }, item) => {
            return (
                <>
                    <Col span={22}>
                        <Row gutter={8}>
                            {cfg.cfgs[item].values.map(vItm => {
                                const FormItem = CForm.FormInt[vItm.type];
                                const ItemProps = {
                                    key: vItm.index,
                                    ...reset,
                                    label: vItm.label,
                                    name: [name, vItm.index],
                                    labelCol: { span: 10 },
                                    wrapperCol: { span: 14 },
                                    rules: [
                                        {
                                            required: !!vItm.require,
                                            message: ""
                                        }
                                    ]
                                };
                                const InputProps = {
                                    placeholder: holderFun(vItm.type, vItm.label)
                                };
                                if (vItm.type == "select") {
                                    InputProps.options = vItm.options.map(v => ({
                                        label: v.label,
                                        value: v.value
                                    }));
                                }
                                return (
                                    <Col span={8}>
                                        <CForm.Item {...ItemProps}>
                                            <FormItem {...InputProps} />
                                        </CForm.Item>
                                    </Col>
                                );
                            })}
                        </Row>
                    </Col>
                </>
            );
        };

        const remderSingleFormItem = item => {
            const FormItem = CForm.FormInt[item.type];
            const ItemProps = {
                key: item.index,
                label: item.label,
                name: item.index,
                labelCol: { span: 4 },
                wrapperCol: { span: 8 },
                rules: [
                    {
                        required: !!item.require,
                        message: ""
                    }
                ]
            };
            const InputProps = {
                placeholder: holderFun(item.type, item.label)
            };
            if (item.type == "select") {
                InputProps.options = item.options.map(v => ({
                    label: v,
                    value: v
                }));
            }
            return (
                <CForm.Item {...ItemProps}>
                    <FormItem {...InputProps} />
                </CForm.Item>
            );
        };

        const comCfg = {
            cForm: "comCfg",
            submitBtn: false,
            wrapperCol: { span: 24 },
            initialValues: (form.pageForm.getFieldValue("cfgs") || [])[index],
            items: [
                {
                    colSpan: { span: 24 },
                    dom: (
                        <>
                            {Object.keys(cfg.cfgs).map((v, index) => {
                                const item = cfg.cfgs[v];
                                if (item.type == "Array") {
                                    return (
                                        <CForm.List name={v} key={index}>
                                            {(fields, { add, remove }) => {
                                                return (
                                                    <>
                                                        {fields.map(field => {
                                                            return (
                                                                <Row key={key}>
                                                                    {renderMultipleFormItem(field, v, remove)}
                                                                    <Col span={2}>
                                                                        {fields.length > 1 && (
                                                                            <MinusCircleOutlined
                                                                                style={{
                                                                                    margin: "0 10px"
                                                                                }}
                                                                                onClick={() => remove(field.name)}
                                                                            />
                                                                        )}
                                                                    </Col>
                                                                </Row>
                                                            );
                                                        })}
                                                        <CForm.Item>
                                                            <Button type='dashed' onClick={() => add()} style={{ width: "100%" }} icon={<PlusOutlined />}>
                                                                添加
                                                            </Button>
                                                        </CForm.Item>
                                                    </>
                                                );
                                            }}
                                        </CForm.List>
                                    );
                                } else {
                                    return <>{remderSingleFormItem(item)}</>;
                                }
                            })}
                        </>
                    )
                }
            ]
        };

        Modal.confirm({
            title: `${com}组件配置`,
            width: 800,
            onOk: async () => {
                const res = await form.comCfg.validateFields();
                const cfgs = form.pageForm.getFieldValue("cfgs") || [];
                cfgs[index] = res;
                form.pageForm.setFieldsValue({ cfgs });
            },
            content: <CForm {...comCfg} />
        });
    };

    const cfg = {
        cForm: "pageForm",
        submitBtn: false,
        wrapperCol: { span: 24 },
        initialValues: { fileName: data.comName },
        items: [
            {
                name: "fileName",
                label: "页面文件夹名称",
                type: "text",
                colSpan: { span: 24 },
                rules: [{ required: true }]
            },
            {
                colSpan: { span: 24 },
                dom: (
                    <CForm.List name='coms'>
                        {(fields, { add, remove }) => {
                            return (
                                <>
                                    {fields.map(field => {
                                        return (
                                            <CForm.Item label='组件' key={field.key} labelCol={{ span: 7 }} wrapperCol={{ span: 17 }} rules={[{ required: true, message: "" }]} {...field}>
                                                <Select
                                                    style={{ width: "80%" }}
                                                    options={data.dir.map(v => ({
                                                        label: v.label,
                                                        value: v.value
                                                    }))}
                                                    placeholder='请选择组件'
                                                    onChange={e => {
                                                        const coms = form.pageForm.getFieldValue("coms");
                                                        coms[field.name] = e;
                                                        form.pageForm.setFieldsValue({ coms });
                                                    }}
                                                />
                                                <div
                                                    className={style.cfg}
                                                    onClick={() => {
                                                        const coms = form.pageForm.getFieldValue("coms")[field?.name];
                                                        comCfg(coms, data.dir.find(v => v.value == coms).config, field.name);
                                                    }}
                                                >
                                                    <ToolTwoTone />
                                                </div>
                                                {fields.length > 1 && (
                                                    <MinusCircleOutlined
                                                        style={{ margin: "0 10px" }}
                                                        onClick={() => {
                                                            remove(field.name);
                                                            const cfgs = form.pageForm.getFieldValue("cfgs") || [];
                                                            cfgs.splice(field.name, 1);
                                                            form.pageForm.setFieldsValue({ cfgs });
                                                        }}
                                                    />
                                                )}
                                            </CForm.Item>
                                        );
                                    })}
                                    <CForm.Item>
                                        <Button
                                            type='dashed'
                                            onClick={() => {
                                                add();
                                                const cfgs = form.pageForm.getFieldValue("cfgs") || [];
                                                cfgs.push(null);
                                                form.pageForm.setFieldsValue({ cfgs });
                                            }}
                                            style={{ width: "100%" }}
                                            icon={<PlusOutlined />}
                                        >
                                            添加
                                        </Button>
                                    </CForm.Item>
                                </>
                            );
                        }}
                    </CForm.List>
                )
            }
        ]
    };

    Modal.confirm({
        title: "页面配置",
        onOk: async () => {
            await form.pageForm.validateFields();
            axios.post("http://localhost:2326/initPage", {
                coms: form.pageForm.getFieldValue(),
                key
            });
        },
        content: <CForm {...cfg} />
    });
};

export { AddRouter, pageEdit };
