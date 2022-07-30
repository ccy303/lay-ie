import React, { useEffect } from "react";
import { Upload, Button, Message } from "antd";
import { file as fileValid } from "@utils/valid";
import { VerticalAlignTopOutlined, CloudUploadOutlined } from "@ant-design/icons";
import { useLocalStore, Observer } from "mobx-react-lite";
// import { upload } from "@src/http/public";
import { toJS } from "mobx";
import style from "./index.less";
export default props => {
    const { onChange = () => {}, afterUpload = () => {}, afterRemove = () => {}, fileSize = 50, fileType, listType = "text", maxCount = Number.MAX_VALUE, fileList, value, id, ...arg } = props;
    const store = useLocalStore(() => {
        return { fileList: [] };
    });

    useEffect(() => {
        if (fileList || value) {
            store.fileList = value && value.length ? [...value] : [...fileList];
        }
    }, [fileList, value]);

    const beforeUpload = async file => {
        try {
            await Promise.all([fileValid.checkSize(file, fileSize)]);
        } catch (err) {
            Message.warning(err);
        }
    };

    /**
     * @param option antd 返回参数
     */
    const customRequest = async option => {
        const formdata = new FormData();
        formdata.append("file", option.files);
        // 发送ajax请求
        // const res = await upload(formdata);
        const file = {
            name: option.file.name,
            uid: option.file.uid,
            thumbUrl: "https://ai.bdstatic.com/file/E2CD6F0D9015424ABD50A4D4A637C3B3",
            url: "https://ai.bdstatic.com/file/E2CD6F0D9015424ABD50A4D4A637C3B3"
        };

        // option.onSuccess(option.file);

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
                            className={maxCount == store.fileList.length ? `${style.upload} ${style["max-count"]}` : style.upload}
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
                                    上传
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
