import { Input, Select, Radio, DatePicker } from "antd";
import React from "react";
const RangeDataPicker = (...arg) => {
    console.log(arg);
	return <DatePicker.RangePicker />;
};

export default {
	text: Input,
	select: Select,
	radio: Radio.Group,
	datePicker: DatePicker,
	// rangeDataPicker: RangeDataPicker,
	rangeDataPicker: DatePicker.RangePicker,
};
