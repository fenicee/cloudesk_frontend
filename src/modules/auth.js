import axios from 'axios';
import router from "@/router";
import store from "@/store";

const state = {
    jwt: localStorage.getItem('jwt') || null,
};

const mutations = {
    SET_JWT(state, jwt) {
        if (jwt === null || jwt === 'null' || jwt ==='undefined') {
            jwt = null;
        }
        state.jwt = jwt;
        localStorage.setItem('jwt', jwt);

        // 同步更新 isLoggedIn 状态
        state.isLoggedIn = !!jwt;

        // 设置axios默认请求头携带Authorization（这部分你应该已经有了）
        if (jwt) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;
        } else {
            delete axios.defaults.headers.common['Authorization'];
        }
    },
    CLEAR_JWT(state) {
        state.jwt = null;
        localStorage.removeItem('jwt');
        delete axios.defaults.headers.common['Authorization'];
    },

};

const actions = {
    async setJwt({ commit }, { jwt }) {
        commit('SET_JWT', jwt);
    },
    async logout({ commit }) {
        try {
            // 清除JWT并更新axios的默认请求头
            commit('CLEAR_JWT');
            await axios.post('/api/logout');
            // 登出成功后重定向到登录页面
            router.push({ path: '/signin' });
        } catch (error) {
            if (error.response && error.response.status === 403) {
                console.log("Token was successfully blacklisted on the server.");
                commit('CLEAR_JWT'); // 在这里再次确保清除JWT，即使服务器返回403
                router.push({ path: '/signin' }); // 还是将用户重定向到登录页
            } else {
                console.error(error);
            }
        }
    },

};

const getters = {
    isLoggedIn: state => {
        const jwtValue = state.jwt;
        return typeof jwtValue === 'string' && jwtValue !== 'null' && jwtValue !== ''&&jwtValue!=='undefined';
    },
    jwt: state => state.jwt
};

// 添加全局错误处理拦截器
axios.interceptors.response.use(
    response => response,
    error => {
        if (error.response) {
            // 当请求已发出但服务器返回的状态码不在2xx范围内时触发
            console.error('Axios Error:', {
                status: error.response.status,
                message: error.response.data.message || error.response.statusText, // 根据实际情况调整错误信息获取方式
                url: error.config.url,
            });

            // 如果收到401 Unauthorized响应，并且是由于Token失效而非登录凭据错误，则执行登出操作
            if (error.response.status === 401 && isTokenInvalid(error)) {
                console.log('Received a 401 Unauthorized response due to token invalidity. Logging out...');
                store.dispatch('logout');
            }
            // 新增：如果收到403 Forbidden响应，可能是因为token过期，也执行登出操作并重定向至登录页
            if (error.response.status === 403 && isTokenInvalid(error)) {
                console.log('Received a 403 Forbidden response possibly due to token expiration or revocation. Logging out...');
                store.dispatch('auth/logout')
            }
        } else if (error.request) {
            // 请求已发出，但是没有收到响应（如网络故障）
            console.error('Axios Network Error:', error.request);
        } else {
            // 发生了一些问题，导致请求未能发送到服务器
            console.error('Unknown Axios Error:', error.message);
        }
        return Promise.reject(error); // 继续将错误传递给调用者
    },
);
// 添加一个辅助函数用于检查错误响应是否与JWT Token失效有关
function isTokenInvalid(error) {
    const { data } = error.response;
    // 检查data中是否有表明token失效的字段或特定消息内容
    return (
        data?.message === 'JWT token has expired' || // 匹配后端实际返回的过期错误信息
        (data?.status === 'failure' && data?.message.startsWith('Token has expired')) // 或者类似的错误信息
    );
}
export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};