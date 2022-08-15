import React, { useEffect } from "react";
import { Button, Input, Space, message } from "antd";
import { useLocalStore, Observer } from "mobx-react-lite";
import { getSms } from "@src/http/public";
import { runInAction } from "mobx";
let TIMER = null;
export default props => {
    const { value, onChange, id, phone, disabled, busType, costomFun, queryData } = props;
    const store = useLocalStore(() => {
        return {
            text: "获取验证码",
            loading: false,
            code: "",
            btnDisabled: false
        };
    });

    const getSmsFun = async () => {
        if (!phone && !costomFun) {
            return message.error("手机号不能为空");
        }
        // 获取短信认证码
        store.btnDisabled = true;
        try {
            await (costomFun || getSms)?.(
                queryData || {
                    bus_type: busType,
                    mobile: phone
                }
            );
            setText();
            message.success("发送成功");
        } catch (err) {
            store.btnDisabled = false;
        }
    };

    const setText = () => {
        store.text = 60;
        TIMER = setInterval(() => {
            if (typeof store.text == "number" && store.text <= 0) {
                clearInterval(TIMER);
                TIMER = null;
                runInAction(() => {
                    store.text = "获取验证码";
                    store.btnDisabled = false;
                });
                return;
            }
            if (typeof store.text != "number") {
                store.text = 60;
            } else {
                store.text -= 1;
            }
        }, 1000);
    };

    useEffect(() => {
        store.code = value;
    }, [value]);

    const inputChange = e => {
        store.code = e.target.value;
        onChange?.(e.target.value);
    };

    return (
        <Observer>
            {() => {
                return (
                    <Space id={id} style={{ width: "100%" }}>
                        <Input
                            onChange={inputChange}
                            value={store.code}
                            placeholder='请输入短信验证码'
                            disabled={disabled}
                        />
                        <Button
                            disabled={store.btnDisabled || disabled}
                            type='primary'
                            onClick={getSmsFun}
                        >
                            {typeof store.text == "number"
                                ? `${store.text}s后重新获取`
                                : store.text}
                        </Button>
                    </Space>
                );
            }}
        </Observer>
    );
};
