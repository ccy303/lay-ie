import React, { useState } from "react";
import { Upload, Button, Message } from "antd";
import { file as fileValid } from "@utils/valid";
import { CloudUploadOutlined } from "@ant-design/icons";
import "./index.less";
export default (props) => {
	const { afterUpload = () => {}, fileSize = 50, listType = "text", ...arg } = props;
	const [fileList, setFileList] = useState([]);
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
	const customRequest = (option) => {
		console.log(option);
		option.onSuccess({ ...option.file, url: "www.baidu.com/xxx.jpg", name: "fjkl;" });
		afterUpload(option.file);
	};

	return (
		<Upload listType={listType} customRequest={customRequest} beforeUpload={beforeUpload} styleName={listType == "text" ? "over-write-style upload" : "upload"} {...arg}>
			{listType == "text" && <Button>上传</Button>}
			{listType != "text" && (
				<div styleName="upload-picture-btn">
					<CloudUploadOutlined style={{ marginBottom: "10px" }} styleName="upload-picture-btn-icon" />
					<span style={{}}>上传图片</span>
				</div>
			)}
		</Upload>
	);
};
