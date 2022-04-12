import React from "react";
import { Form, Row, Col, Button, DatePicker } from "antd";
import FormInt from "./formInt";
import style from "./index.less";

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

const RenderFormItem = (cfg) => {
	const { type, props, dom, itmeArr, ...other } = cfg;
	if (dom) {
		return <div>{cfg.dom}</div>;
	}

	const Com = FormInt[type];

	// if (type == "rangeDataPicker") {
	// 	console.log(1);
	// 	other.getValueFromEvent = (...args) => {
	// 		console.log(123, args);
	// 		return { aa: 123, bbb: 12 };
	// 	};
	// }

	if (itmeArr) {
		console.log(other);
		return (
			<Col span={Math.floor(24 / itmeArr.length)}>
				<Form.Item {...other}>
					<Com
						{...{
							allowClear: true,
							placeholder: holderFun(type, cfg.label),
							...props,
						}}
					/>
				</Form.Item>
			</Col>
		);
	}

	return (
		<Form.Item {...other}>
			<Com
				{...{
					allowClear: true,
					placeholder: holderFun(type, cfg.label),
					...props,
				}}
			/>
		</Form.Item>
	);
};

const FormItemArr = (arr) => {
	return (
		<>
			{arr.map((colItem, idx) => {
				return <RenderFormItem key={idx} itmeArr={arr} {...colItem} />;
			})}
		</>
	);
};

const CForm = (props) => {
	const { items, submitBtn = true, ...other } = props;
	return (
		<Form style={{ width: "100%" }} {...other}>
			<Form.Item name={["startTime", "endTime"]}>
				<DatePicker.RangePicker />
			</Form.Item>
			{/* {items.map((item, idx) => {
				if (Array.isArray(item)) {
					return (
						<Row key={idx} gutter={32}>
							{FormItemArr(item)}
						</Row>
					);
				}
				return <RenderFormItem key={idx} {...item} />;
			})} */}
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

CForm.useForm = Form.useForm;

export default CForm;
