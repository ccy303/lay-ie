import { observable } from "mobx";
export default observable({
    g_userInfo: null,
    g_userAuth: [],
    g_loading: {
        visible: false,
        text: ""
    },
    g_customData: {}
});
