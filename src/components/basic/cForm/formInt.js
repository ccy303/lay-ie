import { Input, Select, Radio, DatePicker } from "antd";
import React, { useEffect } from "react";
import { useLocalStore, Observer } from "mobx-react-lite";
import moment from "moment";
const RangeDataPicker = (props) => {
	const { _form, onChange, value, ...other } = props;
	const store = useLocalStore(() => ({
		value: undefined,
	}));

	useEffect(() => {
		console.log(value);

		store.value = value?.map((v) => v && moment(v));
	}, [value]);

	const dateChange = (e) => {
		onChange?.(e.map((v) => v?.format("YYYY-MM-DD")));
	};

	return (
		<Observer>
			{() => (
				<DatePicker.RangePicker
					{...{
						allowEmpty: [true, true],
						...other,
					}}
					value={store.value}
					onChange={dateChange}
				/>
			)}
		</Observer>
	);
};

export default {
	text: Input,
	select: Select,
	radio: Radio.Group,
	datePicker: DatePicker,
	rangeDataPicker: RangeDataPicker,
	// rangeDataPicker: DatePicker.RangePicker,
};
