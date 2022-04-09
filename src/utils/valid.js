/**
 * conpare conditions return promise
 * @param {*} conditions a Statement return true or false
 * @param {string} msg error message
 */
const conpare = async (conditions, msg) => {
	return conditions ? Promise.reject(msg) : Promise.resolve();
};

/**
 * file validtor
 */
class File {
	checkSize(file, size) {
		return conpare(file.size > 50 * 1024 * 1024, "文件大小超过限制");
	}
}

export const file = new File();
