import { createI18n } from 'vue-i18n';
import EN from './en';
import ZH from './zh';
import Cookies from 'js-cookie';

const messages = {
  zh: {
    ...ZH,
  },
  en: {
    ...EN,
  },
};

// 获取默认语言
export function getLanguage() {
  // const chooseLanguage = Cookies.get('language');
  // if (chooseLanguage) return chooseLanguage;

  // const language = (navigator.language || navigator.browserLanguage).toLowerCase();
  // const locales = Object.keys(messages);
  // for (const locale of locales) {
  //   if (language.indexOf(locale) > -1) {
  //     return locale;
  //   }
  // }
  return 'en';
}

const i18n = createI18n({
  locale: getLanguage(), // 设置当前语言类型
  legacy: false, // 如果要支持compositionAPI，此项必须设置为false;
  globalInjection: true, // 全局注册$t方法
  messages,
});

export default i18n;
