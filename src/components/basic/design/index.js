import React from "react";
import axios from "axios";
import { Message, Button, Select, Form } from "antd";
import { PlusOutlined, ToolTwoTone, MinusCircleOutlined } from "@ant-design/icons";
import Modal from "../cModal";
import CForm from "../cForm";
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
				<CForm {...cfg} />
			</>
		),
	});
};

const comCfg = (e) => {
	console.log(1);
	Message.warning("暂不支持组件配置！");
};

const pageEdit = async (key) => {
	const { data } = await axios.get(`http://localhost:2326/getComponent?routeId=${key}`);
	const form = CForm.useForm();
	const cfg = {
		cForm: "form",
		submitBtn: false,
		wrapperCol: { span: 24 },
		items: [
			{
				name: "fileName",
				label: "页面文件夹名称",
				type: "text",
				colSpan: { span: 24 },
				rules: [{ required: true }],
			},
			{
				colSpan: { span: 24 },
				dom: (
					<CForm.List name="coms">
						{(fields, { add, remove }) => {
							return (
								<>
									{fields.map((field) => {
										return (
											<CForm.Item label="组件" key={field.key} labelCol={{ span: 7 }} wrapperCol={{ span: 14 }}>
												<CForm.Item {...field}>
													<Select
														style={{ width: "85%" }}
														options={data.map((v) => ({ label: v.label, value: v.value }))}
														placeholder="请选择组件"
														onChange={(e) => {
															const coms = form.form.getFieldValue("coms");
															coms[field.name] = e;
															form.form.setFieldsValue({ coms });
														}}
													/>
													<div
														className={style.cfg}
														onClick={() => {
															comCfg(123);
														}}
													>
														<ToolTwoTone />
													</div>
													{fields.length > 1 ? <MinusCircleOutlined style={{ margin: "0 10px" }} onClick={() => remove(field.name)} /> : null}
												</CForm.Item>
											</CForm.Item>
										);
									})}
									<CForm.Item>
										<Button type="dashed" onClick={() => add()} style={{ width: "100%" }} icon={<PlusOutlined />}>
											添加
										</Button>
									</CForm.Item>
								</>
							);
						}}
					</CForm.List>
				),
			},
		],
	};
	Modal.confirm({
		title: "页面配置",
		onOk: async () => {
			axios.post("http://localhost:2326/initPage", { coms: form.form.getFieldValue(), key });
			return false;
		},
		content: <CForm {...cfg} />,
	});
};

export { AddRouter, pageEdit };
