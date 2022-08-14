import React, { useEffect } from "react";
import { Upload, Button, Message } from "antd";
import { file as fileValid } from "@utils/valid";
import { VerticalAlignTopOutlined, CloudUploadOutlined } from "@ant-design/icons";
import { useLocalStore, Observer } from "mobx-react-lite";
import { upload, filePrev } from "@src/http/public";
import { toJS } from "mobx";
import gStore from "@src/store/global";
import style from "./index.less";
export default props => {
    const {
        onChange = () => {},
        afterUpload = () => {},
        afterRemove = () => {},
        fileSize = 50,
        fileType,
        listType = "text",
        maxCount = Number.MAX_VALUE,
        fileList = [],
        value,
        fileUploadType = "",
        id,
        btnText = "上传",
        fullLoading = true,
        ...arg
    } = props;
    const store = useLocalStore(() => {
        return { fileList: [] };
    });
    useEffect(() => {
        if (fileList || value) {
            const _value = (value && value?.filter(v => !!Object.keys(v).length)) || [];
            store.fileList = value && _value.length ? [..._value] : [...fileList];
        }
    }, [fileList, value]);

    const beforeUpload = async file => {
        try {
            const vailArr = [fileValid.checkSize(file, fileSize)];
            if (fileType) {
                vailArr.push(fileValid.checkType(file, fileType));
            }
            await Promise.all(vailArr);
        } catch (err) {
            Message.warning(err);
            return false;
        }
    };

    /**
     * @param option antd 返回参数
     */
    const customRequest = async option => {
        const formdata = new FormData();
        formdata.append("file", option.file);
        // 发送ajax请求
        fullLoading &&
            (gStore.g_loading = {
                visible: true,
                text: "文件上传中..."
            });
        const res = await upload(fileUploadType, formdata);
        fullLoading &&
            (gStore.g_loading = {
                visible: false,
                text: ""
            });
        const file = {
            name: option.file.name,
            uid: res.data_id,
            thumbUrl: filePrev(res.data_id),
            url: filePrev(res.data_id)
        };

        onChange?.([...toJS(store.fileList), { ...file, ...res }]);
        afterUpload?.({ ...file, ...res }, store.fileList);

        if (!fileList) {
            if (maxCount && store.fileList.length < maxCount) {
                store.fileList = [...store.fileList, { ...file }];
            } else {
                store.fileList = [...store.fileList.slice(0, maxCount - 1), { ...file }];
            }
        }
    };

    const onRemove = file => {
        onChange?.(undefined);
        afterRemove?.(file);
        if (!fileList) {
            store.fileList = [...store.fileList.filter(v => v.uid != file.uid)];
        }
    };

    return (
        <Observer>
            {() => {
                return (
                    <div id={id}>
                        <Upload
                            // 没有传入 maxCount maxCount == Number.MAX_VALUE
                            className={
                                maxCount == store.fileList.length
                                    ? `${style.upload} ${style["max-count"]}`
                                    : style.upload
                            }
                            onRemove={onRemove}
                            listType={listType}
                            fileList={store.fileList}
                            customRequest={customRequest}
                            beforeUpload={beforeUpload}
                            {...arg}
                        >
                            {listType == "text" && (
                                <Button>
                                    <VerticalAlignTopOutlined />
                                    {btnText}
                                </Button>
                            )}
                            {listType != "text" && (
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                    <CloudUploadOutlined style={{ fontSize: "32px" }} />
                                    <span>上传图片</span>
                                </div>
                            )}
                        </Upload>
                    </div>
                );
            }}
        </Observer>
    );
};
