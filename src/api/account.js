import service from './index';

// 发送邮箱验证
export const emailVerification = () =>
  service({
    method: 'post',
    url: '/api/accounts/user/resend_email_verification/',
  });

// 获取token
export const getAuthToken = () =>
  service({
    method: 'get',
    url: '/api/accounts/user/get_auth_token',
  });
