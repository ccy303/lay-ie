import React from "react";
export default {
    rootPath: "/home", // 跟路由
    sliderTheme: "dark", // 侧边菜单主题
    title: "金服管理后台脚手架3.0", // 浏览器页签标题
    // 获取用户信息方式
    getUserFun: async () => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // resolve({
                //     userInfo: { phone: "phone****" },
                //     auth: ["auth1", "auth2", "auth3"]
                // });
                reject("err");
            }, 1000);
        });
    },
    // 用户信息获取失败回调，配置此函数后将不会执行框架自带错误处理函数，用户需自己处理后续异常，err:错误信息
    // getUserFunErr: err => {},
    // 应用获取过用户信息后，即将渲染页面前执行，用于设置全局共享数据,全局共享数据会注入到页面组件的props中的gStore.g_customData中，args用户数据 return { ...自定义全局数据 }
    appWillMount: async args => {},
    header: {
        logo: require("@images/logo_dx.png"),
        // logo: (
        //     <a href='/'>
        //         <img src={require("@images/logo_dx.png")} />
        //     </a>
        // ),
        appTitle: "金服管理后台脚手架3.0",
        // appTitle: <span>金服管理后台脚手架3.0</span>
        userInfoDataIndex: "phone", // 展示数据字段,不存在显示 -
        // userInfoDom: props => {}, // 自定义用户信息渲染，不可和userInfoDataIndex公用，props含全部数据
        logoutFun: props => {} // 登出函数props含全部数据
    }
};
