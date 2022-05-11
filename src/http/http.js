import Axios from "axios";
import { Message } from "antd";

const ax = Axios.create({});

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
    response => {
        const { data } = response;
        return data;
    },
    err => {
        return Promise.reject(err);
    }
);

export default ax;
