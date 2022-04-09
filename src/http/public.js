// 获取用户信息
export const getUser = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        userInfo: { phone: "phone****" },
        auth: ["auth1", "auth2", "auth3"],
      });
      // reject("err");
    }, 1000);
  });
};
