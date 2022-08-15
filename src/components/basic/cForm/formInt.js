import {
    Input,
    Select as CSelect,
    Radio as CRadio,
    DatePicker,
    Checkbox as CCheckbox,
    InputNumber,
    Rate as CRate,
    Switch as CSwitch
} from "antd";
import React, { useEffect } from "react";
import { useLocalStore, Observer } from "mobx-react-lite";
import CUpload from "../cUpload";
import moment from "moment";

const CNumber = props => {
    const { onChange, value, ...other } = props;
    const store = useLocalStore(() => ({
        value: undefined
    }));

    useEffect(() => {
        store.value = value;
    }, [value]);

    const dateChange = e => {
        onChange?.(e);
    };

    return (
        <Observer>
            {() => (
                <InputNumber
                    {...{
                        controls: false,
                        ...other
                    }}
                    style={{ width: "100%" }}
                    value={store.value}
                    onChange={dateChange}
                    title={value}
                />
            )}
        </Observer>
    );
};

const CRangeDataPicker = props => {
    const { onChange, value, ...other } = props;
    const store = useLocalStore(() => ({
        value: undefined
    }));

    useEffect(() => {
        store.value = value?.map(v => {
            switch (other.picker) {
                case "week":
                    return v && moment(v.split("-")[0]).isoWeek(v.split("-")[1]);
                case "quarter":
                    return v && moment(v.split("-")[0]).quarter(v.split("-")[1]);
                default:
                    return v && moment(v);
            }
        });
    }, [value]);

    const dateChange = e => {
        switch (other.picker) {
            case "week":
                onChange?.(e.map(v => v?.format("YYYY-WW")));
                break;
            case "month":
                onChange?.(e.map(v => v?.format("YYYY-MM")));
                break;
            case "year":
                onChange?.(e.map(v => v?.format("YYYY")));
                break;
            case "quarter":
                onChange?.(e.map(v => v?.format("YYYY-Q")));
                break;
            default:
                onChange?.(
                    e.map(v =>
                        v?.format(
                            `${other.showTime ? "YYYY-MM-DD HH:mm:ss" : "YYYY-MM-DD 00:00:00"}`
                        )
                    )
                );
        }
    };

    return (
        <Observer>
            {() => (
                <DatePicker.RangePicker
                    {...{
                        allowEmpty: [true, true],
                        ...other
                    }}
                    style={{ width: "100%" }}
                    value={store.value}
                    onChange={dateChange}
                />
            )}
        </Observer>
    );
};

const CDatePicker = props => {
    const { onChange, value, ...other } = props;
    const store = useLocalStore(() => {
        return {
            value: undefined
        };
    });

    useEffect(() => {
        store.value = (() => {
            switch (other.picker) {
                case "week":
                    return value && moment(value.split("-")[0]).isoWeek(value.split("-")[1]);
                case "quarter":
                    return value && moment(value.split("-")[0]).quarter(value.split("-")[1]);
                default:
                    return value && moment(value);
            }
        })();
    }, [value]);

    const dateChange = value => {
        switch (other.picker) {
            case "week":
                onChange?.(value?.format("YYYY-WW"));
                break;
            case "month":
                onChange?.(value?.format("YYYY-MM"));
                break;
            case "year":
                onChange?.(value?.format("YYYY"));
                break;
            case "quarter":
                onChange?.(value?.format("YYYY-Q"));
                break;
            default: {
                onChange?.(
                    value?.format(
                        `${other.showTime ? "YYYY-MM-DD HH:mm:ss" : "YYYY-MM-DD 00:00:00"}`
                    )
                );
            }
        }
    };

    return (
        <Observer>
            {() => (
                <DatePicker
                    {...other}
                    style={{ width: "100%" }}
                    value={store.value}
                    onChange={dateChange}
                />
            )}
        </Observer>
    );
};

export default {
    text: props => <Input title={props.value} {...props} />,
    select: CSelect,
    radio: CRadio.Group,
    datePicker: CDatePicker,
    rangeDataPicker: CRangeDataPicker,
    checkbox: CCheckbox.Group,
    number: CNumber,
    rate: CRate,
    switch: CSwitch,
    upload: CUpload,
    password: Input.Password
};
