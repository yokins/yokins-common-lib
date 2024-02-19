import axios from "axios";

/**
 * 创建一个具有提供的基本 URL 和可选超时、授权注入回调、代码错误回调和响应错误回调的 HTTP 客户端实例。
 *
 * @param {string} baseURL - HTTP 客户端的基本 URL。
 * @param {number} [timeout=1000*60*30] - HTTP 客户端的超时时间，以毫秒为单位。
 * @param {function} [authInjectCb=()=>{}] - 用于将授权信息注入请求配置的回调函数。
 * @param {function} [codeErrorCb=()=>{}] - 用于处理响应中的代码错误的回调函数。
 * @param {function} [responseErrorCb=()=>{}] - 用于处理响应错误的回调函数。
 * @return {Object} 配置好的 HTTP 客户端实例。
 */
const generateHttp = (
    baseURL,
    timeout = 1000 * 60 * 30,
    authInjectCb = () => {},
    codeErrorCb = () => {},
    responseErrorCb = () => {}
) => {
    const http = axios.create({
        baseURL: baseURL,
        timeout: timeout,
    });

    // 请求拦截器
    http.interceptors.request.use(
        (config) => {
            // 在此处添加需要进行授权信息填写的代码
            authInjectCb(config);
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    // 响应拦截器
    http.interceptors.response.use(
        (response) => {
            if (response?.data?.code === 200) {
                // 处理成功请求中的 code == 200 的情况
                return response.data;
            } else {
                // 处理成功请求总的 code != 200 的情况
                codeErrorCb();
                return Promise.reject("请求失败，状态码：" + response.data);
            }
        },
        (error) => {
            // 请求失败的情况
            responseErrorCb();
            return Promise.reject("请求失败，错误信息：" + error.message);
        }
    );

    return http;
};

export { generateHttp };
