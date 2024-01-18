import axios from 'axios';
import { ElNotification, ElMessageBox, ElMessage, ElLoading } from 'element-plus';
import errorCode, { getErrMsg } from '@/utils/errorCode';
import { blobValidate } from '@/utils/tool';
import store from '../store';
import router from '../router';
import i18n from '@/lang/index.js';

let downloadLoadingInstance;
// 是否显示重新登录
export let isRelogin = { show: false };

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8';
// 创建axios实例
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: import.meta.env.VITE_APP_BASE_API,
  // 超时
  timeout: 10000,
});

// request拦截器
service.interceptors.request.use(
  (config) => {
    // 是否需要设置 token
    const isToken = (config.headers || {}).isToken === false;
    if (store.state.token && !isToken) {
      config.headers['Authorization'] = 'Token ' + store.state.token; // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (res) => {
    // 未设置状态码则默认成功状态
    const code = res.data.code || 200;
    // 获取错误信息
    const msg = errorCode[code] || res.data.msg || errorCode['default'];
    // 二进制数据则直接返回
    if (res.request.responseType === 'blob' || res.request.responseType === 'arraybuffer') {
      return res.data;
    }
    if (code === 401) {
      if (!isRelogin.show) {
        isRelogin.show = true;
        ElMessageBox.confirm('登录状态已过期，您可以继续留在该页面，或者重新登录', '系统提示', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            isRelogin.show = false;
            store.dispatch('logOut').then(() => {
              location.href = '/';
            });
          })
          .catch(() => {
            isRelogin.show = false;
          });
      }
      return Promise.reject('无效的会话，或者会话已过期，请重新登录。');
    } else if (code === 500) {
      ElMessage({ message: msg, type: 'error' });
      return Promise.reject(new Error(msg));
    } else if (code === 601) {
      ElMessage({ message: msg, type: 'warning' });
      return Promise.reject(new Error(msg));
    } else if (code !== 200) {
      ElNotification.error({ title: msg });
      return Promise.reject('error');
    } else {
      return Promise.resolve(res.data);
    }
  },
  (error) => {
    let { message, response } = error;
    let isShowMessage = true;
    let messageType = 'error';
    if (message == 'Network Error') {
      message = i18n.global.t('interfaceException');
    } else if (response.config?.headers?.noMessage) {
      isShowMessage = false;
    } else if (message.includes('timeout')) {
      message = i18n.global.t('interfaceTimeout');
    } else if (response.status == 400 && response.data?.password1?.length > 0) {
      message = getErrMsg(response.data.password1[0]);
    } else if (response.status == 400 && response.data?.username?.length > 0) {
      message = getErrMsg(response.data.username[0]);
    } else if (response.status == 400 && response.data?.email?.length > 0) {
      message = getErrMsg(response.data.email[0]);
    } else if (response.status == 400 && response.data?.non_field_errors?.length > 0) {
      // 登录报错
      message = getErrMsg(response.data.non_field_errors[0]);
    } else if (response.status == 400 && response.data?.old_password?.length > 0) {
      message = getErrMsg(response.data.old_password[0]);
    } else if (response.status == 400 && response.data?.new_password2?.length > 0) {
      message = getErrMsg(response.data.new_password2[0]);
    } else if (response.status == 400 && response.data?.github_url?.length > 0) {
      message = getErrMsg(response.data.github_url[0]);
    } else if (response.status == 400 && response.data === 'team_name') {
      message = getErrMsg('The team name has already be used!');
    } else if (response.status == 400 && response.data?.team_name?.length > 0) {
      message = getErrMsg(response.data.team_name[0]);
    } else if (response.status == 400 && response.data?.token?.length > 0) {
      message = getErrMsg(response.data.token[0]);
    } else if (response.status == 400 && response.data?.details) {
      message = getErrMsg(response.data.details);
    } else if (response.status == 400 && response.data?.error) {
      message = getErrMsg(response.data.error);
    } else if (response.status == 400 && response.data?.non_field_errors?.length > 0) {
      message = getErrMsg(response.data.non_field_errors[0]);
    } else if (response.status == 401 && response.data?.error) {
      message = getErrMsg(response.data.error);
    } else if (response.status == 401 && response.data?.detail) {
      message = getErrMsg(response.data.detail);
      if (response.data.detail === 'Invalid token' || response.data.detail === 'Token has expired') {
        messageType = 'info';
        store.dispatch('logOut').then(() => {
          location.href = '/';
        });
      }
    } else if (response.status == 403 && response.data?.detail == 'Please verify your email!') {
      isShowMessage = false;
      router.push('/permissionDenied');
    } else if (response.status == 403 && response.data?.error) {
      message = getErrMsg(response.data.error);
    } else if (response.status == 406 && response.data?.error === 'You are not a participant!') {
      isShowMessage = false;
    } else if (response.status == 406 && response.data?.error) {
      message = getErrMsg(response.data.error);
    } else if (response.status == 429 && response.data?.detail) {
      message = getErrMsg(response.data.detail);
    } else if (message.includes('Request failed with status code')) {
      message = i18n.global.t('systemInterface') + ' ' + message.substr(message.length - 3) + ' ' + i18n.global.t('exception');
    }
    if (isShowMessage) {
      ElMessage({ message: message, grouping: true, type: messageType });
    }
    return Promise.reject(error);
  }
);

// 通用下载方法
export function download(url, params, filename, config) {
  downloadLoadingInstance = ElLoading.service({ text: '正在下载数据，请稍候', background: 'rgba(0, 0, 0, 0.7)' });
  return service
    .post(url, params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      responseType: 'blob',
      ...config,
    })
    .then(async (data) => {
      const isBlob = blobValidate(data);
      if (isBlob) {
        const blob = new Blob([data]);
        // saveAs(blob, filename);
      } else {
        const resText = await data.text();
        const rspObj = JSON.parse(resText);
        const errMsg = errorCode[rspObj.code] || rspObj.msg || errorCode['default'];
        ElMessage.error(errMsg);
      }
      downloadLoadingInstance.close();
    })
    .catch((r) => {
      console.error(r);
      ElMessage.error('下载文件出现错误，请联系管理员！');
      downloadLoadingInstance.close();
    });
}

export default service;
