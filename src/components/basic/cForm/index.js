import React from "react";
import { Form, Row, Col, Button } from "antd";
import FormInt from "./formInt";
import { observable } from "mobx";
import style from "./index.less";

const formStore = observable({
    forms: {}
});

const ItemText = props => {
    return <>{props.value || "-"}</>;
};

export const holderFun = (type, text) => {
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
            password: "输入"
        }[type]
    }${text}`;
};

const FormItem = React.memo(cfg => {
    const { type, props, dom, colLength, colSpan, dtl, ...other } = cfg;
    const Item = () => {
        if (dom) {
            return dom;
        }
        const Com = dtl ? ItemText : FormInt[type];

        return (
            <Form.Item {...other}>
                <Com
                    {...{
                        allowClear: true,
                        placeholder: holderFun(type, cfg.label),
                        dtl,
                        ...props
                    }}
                />
            </Form.Item>
        );
    };
    return (
        <>
            {colLength ? (
                <Col span={colSpan?.span || Math.floor(24 / colLength)}>
                    <Item />
                </Col>
            ) : (
                <Item />
            )}
        </>
    );
});

const CForm = React.memo(props => {
    const {
        autoSetForm = true,
        items,
        submitBtn = true,
        cForm = Object.keys(formStore.forms).length,
        dtl,
        ...other
    } = props;
    const [form] = Form.useForm();
    if (autoSetForm) {
        formStore.forms[cForm] = form;
    }
    return (
        <Form
            style={{ width: "100%" }}
            form={form}
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 17 }}
            {...other}
        >
            <Row gutter={20}>
                {items.map((item, idx) => {
                    const { colSpan } = item;
                    if (Array.isArray(item)) {
                        return (
                            <Col span={24} key={idx}>
                                <Row gutter={20}>
                                    {item.map((colItem, index) => {
                                        return (
                                            <FormItem
                                                dtl={dtl}
                                                colSpan={colSpan}
                                                key={index}
                                                colLength={item.length}
                                                {...colItem}
                                            />
                                        );
                                    })}
                                </Row>
                            </Col>
                        );
                    }
                    return (
                        <Col
                            key={idx}
                            {...(colSpan
                                ? colSpan
                                : {
                                      xs: 12,
                                      lg: 8,
                                      xl: 8,
                                      xxl: 6
                                  })}
                        >
                            <FormItem dtl={dtl} {...item} />
                        </Col>
                    );
                })}
                {submitBtn && (
                    <Col span={24}>
                        <Form.Item wrapperCol={24}>
                            <div className={style["submit-btn-warp"]}>
                                <Button type='primary' htmlType='submit'>
                                    提交
                                </Button>
                            </div>
                        </Form.Item>
                    </Col>
                )}
            </Row>
        </Form>
    );
});

CForm.cUseForm = () => formStore.forms;

CForm.List = Form.List;
CForm.Item = Form.Item;
CForm.FormInt = FormInt;
CForm.useForm = Form.useForm;

export default CForm;
