import React, { useEffect, useImperativeHandle } from "react";
import { useLocalObservable, Observer, observer } from "mobx-react-lite";
import { makeAutoObservable } from "mobx";
import ReactDOM from "react-dom/client";
import { Modal } from "antd";

const store = {
  visible: {},
};

makeAutoObservable(store);

const CModal = (props) => {
  const { children, name = Object.keys(store.visible).length + 1, onOk = () => {}, onCancel = () => {}, ...arg } = props;
  store.visible[name] = false;
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
      {() => (
        <Modal visible={store.visible[name]} onCancel={cancel} onOk={ok} {...arg}>
          {props.children}
        </Modal>
      )}
    </Observer>
  );
};

CModal.acClose = (target) => {
  if (!target) {
    for (const key in store.visible) {
      store.visible[key] = false;
    }
  }
  store.visible[target] = false;
};
CModal.acOpen = (target) => {
  if (!target) {
    for (const key in store.visible) {
      store.visible[key] = true;
    }
  }
  store.visible[target] = true;
};

CModal.confirm = (props) => {
  const { content, onOk = () => {}, onCancel = () => {}, ...other } = props;
  const dom = document.createElement("div");
  document.body.appendChild(dom);
  const Confirm = () => {
    const store = useLocalObservable(() => ({
      visible: true,
    }));
    const cancel = async () => {
      const res = await onCancel();
      if (res === false) {
        return;
      }
      store.visible = false;
      dom.remove();
    };
    const ok = async () => {
      const res = await onOk();
      if (res === false) {
        return;
      }
      store.visible = false;
      dom.remove();
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
  const root = ReactDOM.createRoot(dom);
  root.render(<Confirm />);
};

export const useCModal = () => {
  return CModal;
};

export default CModal;
