import service from './index';

// 用户信息
export const getUser = () =>
  service({
    method: 'get',
    url: '/api/auth/user/',
  });

// 更改用户信息
export const updateUser = (data) =>
  service({
    method: 'PUT',
    url: '/api/auth/user/',
    data,
  });

// 登录
export const login = (data) =>
  service({
    method: 'post',
    url: '/api/auth/login/',
    data,
  });

// 注册
export const register = (data) =>
  service({
    method: 'post',
    url: '/api/auth/registration/',
    data,
  });

// 退出登录
export const logout = () =>
  service({
    method: 'post',
    url: '/api/auth/logout/',
  });

// 密码重置
export const passwReset = (data) =>
  service({
    method: 'post',
    url: '/api/auth/password/reset/',
    data,
  });

// 重置密码
export const resetConfirm = (data) =>
  service({
    method: 'post',
    url: '/api/auth/password/reset/confirm/',
    headers: {
      isToken: false,
    },
    data,
  });

// 更改密码
export const updatePassword = (data) =>
  service({
    method: 'post',
    url: '/api/auth/password/change/',
    data,
  });
