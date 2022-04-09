import { matchPath } from "react-router-dom";

/**
 * 检查权限
 * @param {*} check 需要检查的权限
 * @param {*} auths 当前用户权限
 * @returns true/false
 */
export const checkAuth = (check, auths) => {
  if (!check) {
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

export const getBread = (route, path, out = []) => {
  const arr = path.split("/");
  for (let i = 0; i < arr.length - 1; i++) {
    const _path = arr.slice(0, i + 2).join("/");
    if (route.breadcrumb && (route.path == _path || matchPath(route.fullPathName, _path))) {
      out.push({ title: route.title, path: _path });
    }
  }
  if (route.children) {
    for (let i = 0; i < route.children.length; i++) {
      getBread(route.children[i], path, out);
    }
  }
  return out;
};
