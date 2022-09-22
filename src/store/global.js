import { observable } from "mobx";
export default observable({
    g_userInfo: null,
    g_userAuth: [],
    g_loading: {
        visible: false,
        text: ""
    },
    g_customData: {},
    reouteTreeReloadKey: 0,
    g_config: {
        router: [
            {
                title: "根目录",
                key: "root",
                path: ""
            }
        ]
    }
});
