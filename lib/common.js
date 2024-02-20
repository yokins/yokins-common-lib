/**
 * @description: 计算数字的精度
 * @param {*} number 例子：10000
 * @return {*}
 */
const countDigits = (number) => {
    return number.toString().length - 1;
};

/**
 * @description: 格式化货币形式
 * @param {*} amountStr 例子：10000.000
 * @return {*}
 */
const formatCurrency = (amountStr) => {
    let [integerPart, decimalPart] = amountStr.split(".");
    let formattedIntegerPart = integerPart.replace(
        /\B(?=(\d{3})+(?!\d))/g,
        ","
    );
    let formattedAmount = decimalPart
        ? `${formattedIntegerPart}.${decimalPart}`
        : formattedIntegerPart;
    return formattedAmount;
};

/**
 * @description: 将原始数据转换为人类可读的货币形式
 * @param {*} money 金额
 * @param {*} precision 精度 例子：10000
 * @return {*}
 */
const toHumanMoney = (money, precision) => {
    const digits = countDigits(precision);
    const num = money ?? 0; // 使用空值合并运算符来简化逻辑
    const formattedNum = num.toFixed(digits); // 只传递精度参数
    return formatCurrency(formattedNum);
};

/**
 * @description: 从货币形式转换为原始数据
 * @return {*}
 */
const fromHumanMoney = (formattedAmount) => {
    // 去除金额中的逗号分隔符
    const amountStr = formattedAmount.replace(/,/g, "");
    // 将格式化的金额转换为数字
    return parseFloat(amountStr);
};

/**
 * @description: 把金额转化为能保存到原始数据
 * @param {*} money 金额
 * @param {*} precision 精度
 * @return {*}
 */
const toRealMoney = (money, precision) => {
    const num = fromHumanMoney(money);
    return Math.ceil(money * precision);
};

/**
 * @description: 深拷贝
 * @param {*} obj 需要复制的对象
 * @param {*} hash 缓存已经拷贝过的对象
 * @return {*}
 */
const deepCopy = (obj, hash = new WeakMap()) => {
    if (obj === null || typeof obj !== "object") {
        return obj; // 基本类型和函数直接返回
    }

    if (hash.has(obj)) {
        return hash.get(obj); // 如果已经拷贝过该对象，则直接返回
    }

    let clone = Array.isArray(obj) ? [] : {}; // 判断是数组还是对象
    hash.set(obj, clone); // 记录已经拷贝的对象

    for (let key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            clone[key] = deepCopy(obj[key], hash); // 递归拷贝子对象
        }
    }

    return clone;
};

/**
 * 将给定日期转换为毫秒。
 *
 * @param {Date} date - 要转换的日期
 * @return {number} 从1970年1月1日00:00:00 UTC以来的毫秒数
 */
const dateToSec = (date) => {
    const time = new Date(date);
    if (!(time instanceof Date) || isNaN(time.getTime())) {
        return 0;
    } else {
        return Math.floor(time.getTime() / 1000);
    }
};
/**
 * 将日期转换为毫秒。
 *
 * @param {Date} date - 要转换的日期
 * @return {number} 日期的毫秒表示
 */
const dateToMil = (date) => {
    const time = new Date(date);
    if (!(time instanceof Date) || isNaN(time.getTime())) {
        return 0;
    } else {
        return time.getTime();
    }
};

const legacyOptions = {
    targets: ["defaults", "ie >= 11", "chrome 52", "android >= 7"], //需要兼容的目标列表，可以设置多个
    additionalLegacyPolyfills: ["regenerator-runtime/runtime"],
    renderLegacyChunks: false,
    polyfills: [
        "es.symbol",
        "es.array.filter",
        "es.promise",
        "es.promise.finally",
        "es/map",
        "es/set",
        "es.array.for-each",
        "es.object.define-properties",
        "es.object.define-property",
        "es.object.get-own-property-descriptor",
        "es.object.get-own-property-descriptors",
        "es.object.keys",
        "es.object.to-string",
        "web.dom-collections.for-each",
        "esnext.global-this",
        "esnext.string.match-all",
    ],
};

export {
    toHumanMoney,
    toRealMoney,
    deepCopy,
    dateToSec,
    dateToMil,
    legacyOptions,
};
