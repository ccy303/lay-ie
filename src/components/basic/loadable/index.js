import NProgress from "nprogress";
import loadable from "@loadable/component";
const MyLoadable = (func, other = {}) => {
  const _func = () => {
    NProgress.start();
    return func();
  };
  return loadable(_func, {
    resolveComponent: (conpoments, props) => {
      NProgress.done();
      return conpoments.default;
    },
  });
};

export default MyLoadable;
