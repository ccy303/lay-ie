import { makeAutoObservable } from "mobx";
class Global {
  constructor() {
    makeAutoObservable(this, {}, { deep: false });
  }

  g_userInfo = null;
  g_userAuth = [];
}

export default new Global();
