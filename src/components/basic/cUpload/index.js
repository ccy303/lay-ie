import React, { useEffect } from "react";
import { Upload, Button, Message } from "antd";
import { file as fileValid } from "@utils/valid";
import { VerticalAlignTopOutlined, CloudUploadOutlined } from "@ant-design/icons";
import { useLocalStore, Observer } from "mobx-react-lite";
import style from "./index.less";
export default (props) => {
	const { afterUpload = () => {}, afterRemove = () => {}, fileSize = 50, listType = "text", maxCount = Number.MAX_VALUE, fileList, ...arg } = props;

	const store = useLocalStore(() => {
		return { fileList: [] };
	});

	useEffect(() => {
		if (fileList) {
			store.fileList = [...fileList];
		}
	}, [fileList]);

	const beforeUpload = async (file) => {
		try {
			await Promise.all([fileValid.checkSize(file, 50)]);
		} catch (err) {
			Message.warning(err);
		}
	};

	/**
	 * @param option antd 返回参数
	 */
	const customRequest = async (option) => {
		const formdata = new FormData();
		formdata.append("file", option.files);
		// 发送ajax请求
		// const res = await upload(formdata);
		option.onSuccess({
			...option.file,
			...{
				// ...res
			},
		});
		afterUpload(option.file);
		if (!fileList) {
			// maxCount && store.fileList.length < maxCount
			if (maxCount && store.fileList.length < maxCount) {
				store.fileList = [...store.fileList, option.file];
			} else {
				store.fileList = [...store.fileList.slice(0, maxCount - 1), option.file];
			}
		}
	};

	const onRemove = (file) => {
		afterRemove(file);
		if (!fileList) {
			store.fileList = [...store.fileList.filter((v) => v.uid != file.uid)];
		}
	};

	return (
		<Observer>
			{() => {
				return (
					<Upload
						// maxCount == Number.MAX_VALUE 没有传入 maxCount
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
				);
			}}
		</Observer>
	);
};
