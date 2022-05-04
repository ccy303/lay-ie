import React from "react";
import { Form, Row, Col, Button } from "antd";
import FormInt from "./formInt";
import { observable } from "mobx";
import style from "./index.less";

const formStore = observable({
    forms: {},
});

const holderFun = (type, text) => {
    if (type == "rangeDataPicker") {
        return ["开始日期", "结束日期"];
    }
    if (type == "rate") {
        return;
    }
    return `请${
        {
            text: "输入",
            number: "输入",
            select: "选择",
            checkbox: "选择",
            datePicker: "选择",
        }[type]
    }${text}`;
};

const FormItem = (cfg) => {
    const { type, props, dom, colLength, _form, ...other } = cfg;
    if (dom) {
        return <div>{dom}</div>;
    }

    const Com = FormInt[type];
    const Item = () => (
        <Form.Item {...other}>
            <Com
                {...{
                    allowClear: true,
                    placeholder: holderFun(type, cfg.label),
                    _form,
                    ...props,
                }}
            />
        </Form.Item>
    );

    return (
        <>
            {colLength ? (
                <Col span={Math.floor(24 / colLength)}>
                    <Item />
                </Col>
            ) : (
                <Item />
            )}
        </>
    );
};

const CForm = (props) => {
    const { items, submitBtn = true, cForm = Object.keys(formStore.forms).length, ...other } = props;
    const [form] = Form.useForm();
    formStore.forms[cForm] = form;
    return (
        // labelCol={{ span: 7 }} wrapperCol={{ span: 17 }}
        <Form style={{ width: "100%" }} form={form} {...other}>
            <Row gutter={20}>
                {items.map((item, idx) => {
                    if (Array.isArray(item)) {
                        return (
                            <Col span={24} key={idx}>
                                <Row>
                                    {item.map((colItem, index) => {
                                        return <FormItem key={index} {...colItem} _form={form} colLength={item.length} />;
                                    })}
                                </Row>
                            </Col>
                        );
                    }
                    return (
                        <Col key={idx} xs={12} lg={8} xxl={6}>
                            <FormItem {...item} _form={form} />
                        </Col>
                    );
                })}
                {submitBtn && (
                    <Form.Item>
                        <div className={style["submit-btn-warp"]}>
                            <Button type="primary" htmlType="submit">
                                提交
                            </Button>
                        </div>
                    </Form.Item>
                )}
            </Row>
        </Form>
    );
};

CForm.useForm = () => formStore.forms;

export default CForm;
