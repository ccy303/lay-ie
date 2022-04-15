import React from "react";
import CForm from "@base/CForm";
import { Collapse } from "antd";
const { Panel } = Collapse;

export default () => {
	const cfg1 = {
		cForm: "form1",
		// submitBtn: false,
		initialValues: {
			name1: "123",
			name2: 1,
			date: ["2022-01-02", "2022-01-03"],
			radio: 1,
			check: [1, 2],
			number: 2,
		},
		onFinish: () => {
			console.log(form["form1"].getFieldsValue());
		},
		items: [
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
			[
				{
					name: "check",
					label: "复选框",
					type: "checkbox",
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
				{
					name: "number",
					label: "Rate",
					type: "rate",
				},
				{
					name: "name2",
					label: "文本",
					type: "text",
					rules: [{ required: true }],
				},
			],
		],
	};

	const cfg2 = {
		cForm: "form2",
		onFinish: () => {
			console.log(form["form2"].getFieldsValue());
		},
		items: [
			{
				name: "date",
				label: "日期",
				type: "datePicker",
			},
			{
				name: "date&time",
				label: "日期&时间",
				type: "datePicker",
				props: { showTime: true },
			},
			{
				name: "week",
				label: "周",
				type: "datePicker",
				props: { picker: "week" },
			},
			{
				name: "month",
				label: "月份",
				type: "datePicker",
				props: { picker: "month" },
			},
			{
				name: "quarter",
				label: "季度",
				type: "datePicker",
				props: { picker: "quarter" },
			},
			{
				name: "year",
				label: "年份",
				type: "datePicker",
				props: { picker: "year" },
			},
			{
				name: "dateRange",
				label: "日期范围",
				type: "rangeDataPicker",
			},
			{
				name: "weekRange",
				label: "周范围",
				type: "rangeDataPicker",
				props: { picker: "week" },
			},
			{
				name: "monthRange",
				label: "月范围",
				type: "rangeDataPicker",
				props: { picker: "month" },
			},
			{
				name: "quarterRange",
				label: "季度范围",
				type: "rangeDataPicker",
				props: { picker: "quarter" },
			},
			{
				name: "yearRange",
				label: "年范围",
				type: "rangeDataPicker",
				props: { picker: "year" },
			},
			{
				name: "date&timeRange",
				label: "日期&时间范围",
				type: "rangeDataPicker",
				props: { showTime: true },
			},
		],
	};

	const form = CForm.useForm();

	return (
		<div>
			<Collapse defaultActiveKey={[2]}>
				<Panel key={1} header="items通过数组设置多行多列">
					<CForm {...cfg1} />
				</Panel>
				<Panel key={2} header="通过grid配置行列（时间选择器）">
					<CForm {...cfg2} />
				</Panel>
			</Collapse>
		</div>
	);
};
