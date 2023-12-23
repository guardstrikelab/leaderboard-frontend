import router from './router';
import store from './store';

const whiteList = ['/auth/verifyEmail', '/challenge/home'];

// 守卫
router.beforeEach((to, from, next) => {
  if (store.state.token) {
    if (to.path === '/auth/verifyEmail') {
      next();
    } else if (to.path.startsWith('/auth/')) {
      next({ path: '/' });
    } else {
      if (!store.state.userInfo.pk) {
        store
          .dispatch('getUserInfo')
          .then((res) => {
            next({ ...to, replace: true });
          })
          .catch((err) => {
            store
              .dispatch('logOut')
              .then((res) => {
                next({ path: '/' });
              })
              .catch((err) => {
                next({ path: '/' });
              });
          });
      } else if (to.path.startsWith('/host')) {
        if (store.state.isHost === 1) {
          next();
        } else if (store.state.isHost == 0) {
          next({ path: '/' });
        } else {
          store
            .dispatch('verifyHostUser')
            .then((res) => {
              next();
            })
            .catch((err) => {
              next({ path: '/' });
            });
        }
      } else {
        next();
      }
    }
  } else {
    // 没有token
    if (to.path.startsWith('/auth/') || to.path.startsWith('/challenge/detail/') || whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next();
    } else {
      next(`/auth/login?redirect=${to.fullPath}`); // 否则全部重定向到登录页
    }
  }
});
