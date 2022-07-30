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
        const { data, headers } = response;
        return response.headers["x-total-count"] ? { data: formatBody(data), total: headers["x-total-count"] } : formatBody(data);
    },
    err => {
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
