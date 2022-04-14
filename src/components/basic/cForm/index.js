import React from "react";
import { Form, Row, Col, Button, DatePicker } from "antd";
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
	return `请${
		{
			text: "输入",
			select: "选择",
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
		<Form style={{ width: "100%" }} form={form} {...other}>
			{items.map((item, idx) => {
				if (Array.isArray(item)) {
					return (
						<Row key={idx} gutter={32}>
							{item.map((colItem, index) => {
								return <FormItem key={index} {...colItem} _form={form} colLength={item.length} />;
							})}
						</Row>
					);
				}
				return <FormItem key={idx} {...item} _form={form} />;
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
		</Form>
	);
};

CForm.useForm = () => formStore.forms;

export default CForm;
