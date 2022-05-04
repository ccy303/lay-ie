import axios from "axios";
import { Message } from "antd";

const _axios = new axios();

// 请求拦截
_axios.interceptors.request.use((config) => {
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
_axios.interceptors.response.use(
    (response) => {
        const { data } = response;
        return data;
    },
    (err) => {
        return Promise.reject(err);
    }
);

export default _axios;
