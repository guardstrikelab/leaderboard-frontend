import i18n from '@/lang/index.js';
// 验证是否为blob格式
export function blobValidate(data) {
  return data.type !== 'application/json';
}

/**
 * 确认弹框  默认以删除任务为例
 * @param {*} params
 * @returns  promise
 */
export function oaMessageBox(params = {}, extraConfig = {}) {
  const {
    icon,
    title = '删除所选任务',
    message = '删除后将无法恢复，请确认是否删除?',
    confirmButtonText = i18n.global.t('yes'),
    cancelButtonText = i18n.global.t('no'),
  } = params;
  let style = icon ? '' : 'display:none;';
  return ElMessageBox.confirm(
    `
    <div class="title">
      <svg class="icon" aria-hidden="true" style="font-size: 21px;${style}">
        <use xlink:href="${icon}"></use>
      </svg>
      <span>${title}</span>
    </div>
    <div class="content">${message}</div>
  `,
    {
      dangerouslyUseHTMLString: true,
      confirmButtonText,
      cancelButtonText,
      cancelButtonClass: 'is-text is-has-bg',
      customClass: 'oa-message-box',
      ...extraConfig,
    }
  );
}

// 格式化时间
export function formatTime(value) {
  const date = new Date(value);
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true,
  };
  return date.toLocaleString(i18n.global.locale.value, options);
}
