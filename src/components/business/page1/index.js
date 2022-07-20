import React from "react";
import CForm from "@base/cForm";
import { Spin, Button } from "antd";
import { useLocalStore, Observer } from "mobx-react-lite";

const Page = () => {
    const form = CForm.cUseForm();
    const store = useLocalStore(() => {
        return {
            loading: false
        };
    });
    return (
        <Observer>
            {() => {
                return (
                    <Spin spinning={store.loading}>
                        <CForm
                            {...{
                                cForm: "form1",
                                submitBtn: false,
                                items: [
                                    {
                                        name: "测试",
                                        label: "测试",
                                        type: "text",
                                        rules: [{ required: true }]
                                    },
                                    {
                                        dom: (
                                            <Button
                                                onClick={async () => {
                                                    store.loading = true;
                                                    setTimeout(() => {
                                                        console.log(form.form1.validateFields());
                                                    });
                                                }}
                                            >
                                                提交
                                            </Button>
                                        )
                                    }
                                ]
                            }}
                        />
                    </Spin>
                );
            }}
        </Observer>
    );
};

export default Page;
