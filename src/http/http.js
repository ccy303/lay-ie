import Axios from "axios";
import { message } from "antd";
import { appConfig } from "@root/appConfig";

const { http } = appConfig;

const ax = Axios.create(http?.axiosCfg || {});

// 请求拦截
ax.interceptors.request.use(config => {
    if (config.method.toLocaleLowerCase() === "get") {
        if (config.params) {
            config.params._t = new Date().getTime();
        } else {
            config.url += `?t=${new Date().getTime()}`;
        }
    }
    return config;
});

// 响应拦截
ax.interceptors.response.use(
    response => http.httpWILLResponse(response),
    err => {
        !err.response?.config?.headers?.["NO-E-MSG"] && message.error(http.formatErrMsg(err));
        http.httpWILLReject?.(err);
        return Promise.reject(err);
    }
);

const formatBody = data => {
    let output = data;
    if (Object.prototype.toString.call(data) == "[object Array]") {
        output = data.map(v => {
            return formatBody(v);
        });
    }
    if (Object.prototype.toString.call(data) == "[object Object]") {
        output = {};
        Object.keys(data).map(v => {
            const key = v.replace(/[A-Z]/g, $1 => `_${$1.toLowerCase()}`);
            output[key] = formatBody(data[v]);
        });
    }
    return output;
};

export default ax;
