import React from "react";
import { useLocalStore, Observer } from "mobx-react-lite";
import { observable } from "mobx";
import ReactDOM from "react-dom";
import zhCN from "antd/lib/locale/zh_CN";
import { Modal, ConfigProvider } from "antd";

const store = observable(
    {
        visible: {}
    },
    {},
    { deep: true }
);

const CModal = props => {
    const {
        children,
        name = Object.keys(store.visible).length + 1,
        onOk = () => {},
        onCancel = () => {},
        ...arg
    } = props;
    store.visible = {
        ...store.visible,
        [name]: false
    };
    const localStore = useLocalStore(() => ({
        loading: false
    }));
    const cancel = async () => {
        await onCancel();
        store.visible[name] = false;
    };

    const ok = async () => {
        localStore.loading = true;
        try {
            await onOk();
            localStore.loading = false;
            store.visible[name] = false;
        } catch (err) {
            localStore.loading = false;
        }
    };

    return (
        <Observer>
            {() => {
                return (
                    <Modal
                        visible={store.visible[name]}
                        confirmLoading={localStore.loading}
                        onCancel={cancel}
                        onOk={ok}
                        {...arg}
                    >
                        {props.children}
                    </Modal>
                );
            }}
        </Observer>
    );
};

CModal.acClose = target => {
    if (!target) {
        for (const key in store.visible) {
            store.visible[key] = false;
        }
    }
    store.visible[target] = false;
};

CModal.acOpen = target => {
    if (!target) {
        for (const key in store.visible) {
            store.visible[key] = true;
        }
    }
    store.visible[target] = true;
};

CModal.confirm = props => {
    const { content, onOk = () => {}, onCancel = () => {}, ...other } = props;
    const dom = document.createElement("div");
    document.body.appendChild(dom);

    const Comfirm = () => {
        const store = useLocalStore(() => ({
            visible: true,
            loading: false
        }));
        const cancel = async () => {
            try {
                const res = await onCancel();
                if (res === false) {
                    return;
                }
                store.visible = false;
            } catch (err) {
                store.loading = false;
                throw new Error(err);
            }
        };
        const ok = async () => {
            store.loading = true;
            try {
                const res = await onOk();
                store.loading = false;
                if (res === false) {
                    return;
                }
                store.visible = false;
            } catch (err) {
                store.loading = false;
                throw new Error(err);
            }
        };
        return (
            <Observer>
                {() => (
                    <ConfigProvider locale={zhCN} prefixCls='linkfin'>
                        <Modal
                            visible={store.visible}
                            confirmLoading={store.loading}
                            onCancel={cancel}
                            onOk={ok}
                            {...other}
                        >
                            {content}
                        </Modal>
                    </ConfigProvider>
                )}
            </Observer>
        );
    };

    ReactDOM.render(<Comfirm />, dom);
};

export const useCModal = () => {
    return CModal;
};

export default CModal;
