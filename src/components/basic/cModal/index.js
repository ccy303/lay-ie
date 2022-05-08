import React from "react";
import { useLocalStore, Observer } from "mobx-react-lite";
import { observable } from "mobx";
import ReactDOM from "react-dom";
import { Modal } from "antd";

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
    const cancel = async () => {
        await onCancel();
        store.visible[name] = false;
    };

    const ok = async () => {
        await onOk();
        store.visible[name] = false;
    };

    return (
        <Observer>
            {() => {
                return (
                    <Modal visible={store.visible[name]} onCancel={cancel} onOk={ok} {...arg}>
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
    const Confirm = () => {
        const store = useLocalStore(() => ({
            visible: true
        }));
        const cancel = async () => {
            const res = await onCancel();
            if (res === false) {
                return;
            }
            dom.remove();
            store.visible = false;
        };
        const ok = async () => {
            const res = await onOk();
            if (res === false) {
                return;
            }
            dom.remove();
            store.visible = false;
        };
        return (
            <Observer>
                {() => (
                    <Modal visible={store.visible} onCancel={cancel} onOk={ok} {...other}>
                        {content}
                    </Modal>
                )}
            </Observer>
        );
    };
    ReactDOM.render(<Confirm />, dom);
};

export const useCModal = () => {
    return CModal;
};

export default CModal;
