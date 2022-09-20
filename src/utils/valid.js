/**
 * conpare conditions return promise
 * @param {*} conditions a Statement return true or false
 * @param {string} msg error message
 */

import validtor from "validator";

// 是手机号检验
export const isPhoneNum = (str, msg) => {
    return validtor.isMobilePhone(str, ["zh-TW", "zh-MO", "zh-HK", "zh-CN"]);
};

/**
 * file validtor
 */
class File {
    async conpare(conditions, msg) {
        return conditions ? Promise.reject(msg) : Promise.resolve();
    }

    checkSize(file, size) {
        return this.conpare(file.size > size * 1024 * 1024, "文件大小超过限制");
    }

    checkType(file, types) {
        const suffix = file?.name?.split(".").pop();
        return this.conpare(
            !types.includes(suffix) && !types.includes(suffix?.toLowerCase()),
            "文件格式不正确"
        );
    }
}

export const file = new File();
