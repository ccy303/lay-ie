import React, { useEffect } from "react";
import { useLocalStore, Observer } from "mobx-react-lite";
import { toJS } from "mobx";
import CUpload from "@base/cUpload";
import style from "./index.less";

export default props => {
    const { onChange = () => {}, value, disabled, id, fileUploadType = [] } = props;
    const store = useLocalStore(() => {
        return { list: [] };
    });
    const onFileChange = (file, index) => {
        const list = store.list.length ? toJS(store.list) : [{}, {}];
        list[index] = file;
        store.list = list;
        const target = store.list.find(v => !Object.keys(v).length);
        !target && onChange?.(toJS(store.list));
    };

    const onFileRemove = index => {
        const list = toJS(store.list);
        list.splice(index, 1, {});
        store.list = list;
        onChange?.(null);
    };

    useEffect(() => {
        value && (store.list = value);
    }, [value]);

    return (
        <Observer>
            {() => {
                return (
                    <div className={style["id-card"]} id={id}>
                        <div className={`${style["id-card-item"]} ${style["m-r-20"]}`}>
                            <CUpload
                                fileList={
                                    store.list[0] && Object.keys(store.list[0]).length
                                        ? [store.list[0]]
                                        : []
                                }
                                fileUploadType={fileUploadType[0]}
                                afterUpload={file => onFileChange(file, 0)}
                                afterRemove={() => onFileRemove(0)}
                                listType='picture-card'
                                maxCount={1}
                                disabled={disabled}
                                fileSize={10}
                                fileType={["jpg", "png"]}
                            />
                            <p>身份证正面</p>
                        </div>
                        <div className={style["id-card-item"]}>
                            <CUpload
                                fileList={
                                    store.list[1] && Object.keys(store.list[1]).length
                                        ? [store.list[1]]
                                        : []
                                }
                                fileUploadType={fileUploadType[1]}
                                afterUpload={file => onFileChange(file, 1)}
                                afterRemove={() => onFileRemove(1)}
                                listType='picture-card'
                                maxCount={1}
                                disabled={disabled}
                                fileSize={10}
                                fileType={["jpg", "png"]}
                            />
                            <p>身份证反面</p>
                        </div>
                    </div>
                );
            }}
        </Observer>
    );
};
