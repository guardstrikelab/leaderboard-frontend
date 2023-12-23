import './styles/global.scss';
import '@/assets/iconfont/iconfont';
import 'element-plus/theme-chalk/dark/css-vars.css';
import 'ress/dist/ress.min.css';

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import i18n from './lang/index';
import './permission';
import store from './store';
import Directive from './directives';

const app = createApp(App);

app.use(store).use(router).use(i18n).use(Directive).mount('#app');
