import ax from "./http";
// 获取用户信息
export const getUser = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({
                userInfo: { phone: "phone****" },
                auth: ["auth1", "auth2", "auth3"]
            });
            // reject("err");
        }, 1000);
    });
};

// 文件预览
export const filePrev = id => ``;

// 文件下载
export const download = id => ``;

// 文件上传
export const upload = data =>
    ax.post(`/`, data, { headers: { "Content-Type": "multipart/form-data" } });
