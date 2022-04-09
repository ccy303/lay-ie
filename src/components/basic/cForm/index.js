import React from "react";
import { Form, Row, Col, Button } from "antd";
import FormInt from "./formInt";
import "./index.less";
const FormItemArr = (arr) => {
	return (
		<>
			{arr.map((colItem, colIIndex) => {
				if (colItem.dom) {
					return <div key={colIIndex}>{colItem.dom}</div>;
				}
				const { type, props, ...other } = colItem;
				const Com = FormInt[type];
				return (
					<Col key={colIIndex} span={Math.floor(24 / arr.length)}>
						<Form.Item name={colItem.name} {...other}>
							<Com {...props} />
						</Form.Item>
					</Col>
				);
			})}
		</>
	);
};

const CForm = (props) => {
	const { items, submitBtn = true, ...other } = props;
	return (
		<Form style={{ width: "100%" }} {...other}>
			{items.map((item, itemIndex) => {
				if (Array.isArray(item)) {
					return (
						<Row key={itemIndex} gutter={32}>
							{FormItemArr(item)}
						</Row>
					);
				}
				if (item.dom) {
					return <div key={itemIndex}>{item.dom}</div>;
				}
				const { type, props, ...other } = item;
				const Com = FormInt[type];
				return (
					<Form.Item key={itemIndex} {...other}>
						<Com {...props} />
					</Form.Item>
				);
			})}
			{submitBtn && (
				<Form.Item>
					<div styleName="submit-btn-warp">
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
