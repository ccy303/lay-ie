import { matchPath } from "react-router-dom";

/**
 * 检查权限
 * @param {*} check 需要检查的权限
 * @param {*} auths 当前用户权限
 * @returns true/false
 */
export const checkAuth = (check, auths) => {
    if (!check || !check?.length) {
        return true;
    }
    for (let i = 0; i < check.length; i++) {
        const arr = check[i].split("&");
        let flag = 0;
        for (let j = 0; j < arr.length; j++) {
            auths.includes(arr[j].trim()) && flag++;
            if (flag == j + 1) {
                return true;
            }
        }
        if (i == check.length) {
            return false;
        }
    }
    return false;
};

/**
 * 深度优先查找当前记过路由
 * @param {*} route 路由
 * @param {*} path 当前路径
 * @param {*} join 拼接路由
 * @returns { Object | Boolean } 查询到时返回：{path: 当前激活路径, reoute: 当前激活路由}；无结果返回：false
 */
export const getActiveRoute = (route, path, join = "") => {
    let out = false;
    const _path = `${join || ""}${route.path}`;
    if (matchPath(_path, path)) {
        out = { path: route.activePath || _path, route };
    } else if (route.children) {
        for (let i = 0; i < route.children.length; i++) {
            out = getActiveRoute(route.children[i], path, _path);
            if (out) {
                break;
            }
        }
    }
    return out;
};

/**
 * 根据keys value 查找route
 * @param {*} routes
 * @param {*} keys
 * @param {*} vals
 * @returns
 */
export const findRoute = (routes, keys, vals) => {
    let out = false;
    for (let i = 0; i < routes.length; i++) {
        if (routes[i].children) {
            out = findRoute(routes[i].children, keys, vals);
        } else {
            if (Array.isArray(keys)) {
                for (let j = 0; j < keys.length; j++) {
                    if (routes[i][keys[j]] != vals[j]) {
                        break;
                    }
                    if (j == keys.length) {
                        out = routes[i];
                    }
                }
            } else if (routes[i][keys] == vals) {
                out = routes[i];
                break;
            }
        }
    }
    return out;
};

/**
 * 获取面包屑
 * @param {*} route
 * @param {*} path
 * @param {*} out
 * @returns
 */
export const getBread = (route, path, out = []) => {
    // eslint-disable-next-line
    // debugger;
    const arr = path.split("/");
    for (let i = 0; i < arr.length - 1; i++) {
        const _path = arr.slice(0, i + 2).join("/");
        if (route.breadcrumb && (route.path == _path || matchPath(route.fullPathName, _path))) {
            out.push({ title: route.title, path: _path, disabled: route.breadcrumb?.disabled });
        }
    }
    if (route.children) {
        for (let i = 0; i < route.children.length; i++) {
            getBread(route.children[i], path, out);
        }
    }
    return out;
};

/**
 * 获取屏幕宽度
 * @param {Boolean} antdGrid 是否转化为antd Grid 尺寸
 */
export const getClientW = antdGrid => {
    const { offsetWidth } = document.body;
    if (!antdGrid) {
        return offsetWidth;
    }
    if (offsetWidth >= 1600) {
        return "xxl";
    }
    if (offsetWidth >= 1200) {
        return "xl";
    }
    if (offsetWidth >= 992) {
        return "lg";
    }
    if (offsetWidth >= 768) {
        return "md";
    }
    if (offsetWidth >= 576) {
        return "sm";
    }
    if (offsetWidth < 576) {
        return "xs";
    }
};

/**
 * 格式化primise错误信息 {name: string, error: object}
 * @param {Primise Function} promise  promise队列
 */
export const formatePromise = (promise, name) => {
    return new Promise((resolve, reject) => {
        promise()
            .then(res => {
                resolve(res);
            })
            .catch(err => {
                reject({ name: name || promise.name, error: err });
            });
    });
};

// 格式化金额
export const thousandBit = num => {
    if (!num || isNaN(Number(num))) {
        return "";
    }
    num = Number(num)?.toFixed(2);
    return String(num).replace(/\d+/, n => {
        /* eslint-disable */
        return n.replace(/(\d)(?=(\d{3})+$)/g, $1 => {
            return `${$1},`;
        });
    });
};

export const getAuthCenter = () => {
    const [match] = window.location.origin.match(/uat|dev|sit|localhost|127\.0\.0\.1/) || ["product"];
    return { product: "https://id.caih.com/" }[match] || "https://id-test.linkfinance.cn/";
};

export const getClientId = () => {
    const [match] = window.location.origin.match(/uat|dev|sit|localhost|127\.0\.0\.1/) || ["product"];
    return { product: "6e14867aaa724f9dbae4d35cf0b74877" }[match] || "c83ab8923263451dbe240a4f3c2c12d6";
};

export const getFt = () => {
    const [match] = window.location.origin.match(/uat|dev|sit|localhost|127\.0\.0\.1/) || ["product"];
    return (
        {
            dev: "http://ft.dev.linkfin.caih.local",
            sit: "http://ft.sit.linkfin.caih.local",
            uat: "http://ft.uat.linkfin.caih.local",
            localhost: "http://ft.dev.linkfin.caih.local",
            ["127.0.0.1"]: "http://ft.dev.linkfin.caih.local"
        }[match] || "https://ft.caih.com/"
    );
};
