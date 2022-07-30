import React, { useEffect } from "react";
import { Button, Input, Space } from "antd";
import { useLocalStore, Observer } from "mobx-react-lite";
let TIMER = null;
export default props => {
    const { value, onChange, id } = props;
    const store = useLocalStore(() => {
        return {
            text: "获取验证码",
            loading: false,
            code: ""
        };
    });

    const getSms = () => {
        store.loading = true;
        // 获取短信认证码
        store.loading = false;
        setText();
    };

    const setText = () => {
        TIMER = setInterval(() => {
            if (typeof store.text == "number" && store.text <= 0) {
                clearInterval(TIMER);
                TIMER = null;
                store.text = "获取验证码";
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
                    <Space id={id}>
                        <Input onChange={inputChange} value={store.code} placeholder='请输入短信验证码' />
                        <Button loading={store.loading} disabled={typeof store.text == "number"} type='primary' onClick={getSms}>
                            {typeof store.text == "number" ? `${store.text}s后重新获取` : store.text}
                        </Button>
                    </Space>
                );
            }}
        </Observer>
    );
};
