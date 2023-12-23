import copyText from './copyText';

export default {
  install(app) {
    app.directive('copyText', copyText);
  },
};
