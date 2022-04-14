import React from "react";
import { Button, Collapse } from "antd";
import CModal, { useCModal } from "@base/cModal";
import CUpload from "@base/CUpload";
import { useLocalStore, Observer } from "mobx-react-lite";
const { Panel } = Collapse;
import CForm from "@base/CForm";
export default (props) => {
	const store = useLocalStore(() => {
		return {
			fileList1: [],
			fileList2: [],
		};
	});

	const modal = useCModal();

	const confirm1 = () => {
		modal.acOpen("m1");
	};

	const confirm2 = () => {
		modal.acOpen();
		setTimeout(() => {
			modal.acClose();
		}, 10000);
	};

	const confirm3 = () => {
		CModal.confirm({
			title: "CModal.confirm 调用",
			content: <>CModal.confirm 弹框</>,
		});
	};

	const afterUpload1 = (file) => {
		store.fileList1 = [...store.fileList1, file];
	};

	const afterRemove1 = (file) => {
		store.fileList1 = [...store.fileList1.filter((v) => v.uid != file.uid)];
	};

	const afterUpload2 = (file) => {
		store.fileList2 = [...store.fileList2, file];
	};

	const afterRemove2 = (file) => {
		store.fileList2 = [...store.fileList2.filter((v) => v.uid != file.uid)];
	};

	const form = CForm.useForm();

	const cfg = {
		cForm: "form1",
		// submitBtn: false,
		initialValues: {
			name1: "123",
			name2: 1,
			date: ["2022-01-02", "2022-01-03"],
			radio: 1,
		},
		onFinish: () => {
			console.log(form["form1"].getFieldsValue());
		},
		items: [
			{
				dom: <h4 style={{ marginBottom: "10px" }}>这是一个普通的自定义dom元素</h4>,
			},
			[
				{
					name: "name1",
					label: "文本",
					type: "text",
					rules: [{ required: true }],
				},
				{
					name: "name2",
					label: "下拉",
					type: "select",
					rules: [{ required: true }],
					props: {
						options: [
							{ label: "供应商", value: 1 },
							{ label: "金融机构", value: 2 },
						],
					},
				},
				{
					name: "date",
					label: "日期范围选择器",
					type: "rangeDataPicker",
				},
			],
			[
				{
					name: "radio",
					label: "单选框",
					type: "radio",
					props: {
						options: [
							{
								label: "供应商",
								value: 1,
							},
							{
								label: "金融机构",
								value: 2,
							},
						],
					},
				},
			],
		],
	};

	return (
		<div>
			<Collapse defaultActiveKey={[3]}>
				<Panel key={1} header={<>CModal：提供以函数调用形式控制对话框,无需在另外定义state控制。</>}>
					<Button onClick={confirm1}>打开单个弹框</Button>
					<div style={{ margin: "10px 0" }}>useCModal 提供 useCModal.acOpen\acClose( name ) 函数打开\关闭 组件指定了属性name的对话框</div>
					<hr />
					<Button onClick={confirm2}>打开多个弹框,10S后关闭</Button>
					<div style={{ margin: "10px 0" }}>若页面挂在了多了Modal, 且都没指定name, useCModal.acOpen\acClose() 函数也没有指定入参函数将按照挂在顺序打开\关闭全部弹窗</div>
					<hr />
					<Button onClick={confirm3}>函数式调用</Button>
					<div style={{ margin: "10px 0" }}>CModal 提供 confirm() 函数打开单个confirm 对话框</div>
				</Panel>
				<Panel key={2} header={<>CUpload：文件上传</>}>
					<div style={{ width: "50%" }}>
						<Observer>
							{() => {
								return <CUpload afterUpload={afterUpload1} afterRemove={afterRemove1} fileList={store.fileList1} maxCount={2} />;
							}}
						</Observer>
					</div>
					<div style={{ width: "50%", marginTop: "20px" }}>
						<Observer>
							{() => {
								return <CUpload afterUpload={afterUpload2} afterRemove={afterRemove2} listType="picture-card" maxCount={3} />;
							}}
						</Observer>
					</div>
				</Panel>
				<Panel key={3} header={<>CForm在不破环antd表单支持情况下实现的配置式表单设置</>}>
					<CForm {...cfg} />
				</Panel>
			</Collapse>
			<CModal name="m1" title="普通弹框">
				这是个普通弹框1
			</CModal>
			<CModal title="普通弹框">这是个普通弹框2</CModal>
			<CModal title="普通弹框">这是个普通弹框3</CModal>
		</div>
	);
};
