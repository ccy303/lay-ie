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
export const filePrev = id => `/client/file/show/${id}`;

// 文件上传
export const upload = (type, data) =>
    ax.post(`/client/file/${type}`, data, { headers: { "Content-Type": "multipart/form-data" } });

// 获取枚举
export const getEnums = () => ax.get("/client/enum");

// 获取短信
export const getSms = data => ax.post("/client/message/verif-code", data);

// 电子账户下拉选择
export const getCusAccSelList = params => ax.get(`/client/eac-info/eac-no`, { params });

// 账户激活金融机构下拉
export const getFncList = () => ax.get("/client/eac-info/financial-name");
