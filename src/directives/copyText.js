/**
 * v-copyText 复制文本内容
 * Copyright (c) 2023 oasis
 */

export default {
  mounted(el, { value }) {
    el.$copyValue = value.txt;
    el.$resMessage = value.msg;
    const handler = () => {
      copyTextToClipboard(el.$copyValue);
      ElMessage.success(el.$resMessage);
    };
    el.addEventListener('click', handler);
    el.$destroyCopy = () => el.removeEventListener('click', handler);
  },
  // 在绑定元素的父组件及他自己的所有子节点都更新后调用
  updated(el, { value }) {
    el.$copyValue = value.txt;
    el.$resMessage = value.msg;
  },
};

function copyTextToClipboard(input, { target = document.body } = {}) {
  const element = document.createElement('textarea');
  const previouslyFocusedElement = document.activeElement;

  element.value = input;

  // Prevent keyboard from showing on mobile
  element.setAttribute('readonly', '');

  element.style.contain = 'strict';
  element.style.position = 'absolute';
  element.style.left = '-9999px';
  element.style.fontSize = '12pt'; // Prevent zooming on iOS

  const selection = document.getSelection();
  const originalRange = selection.rangeCount > 0 && selection.getRangeAt(0);

  target.append(element);
  element.select();

  // Explicit selection workaround for iOS
  element.selectionStart = 0;
  element.selectionEnd = input.length;

  let isSuccess = false;
  try {
    isSuccess = document.execCommand('copy');
  } catch {}

  element.remove();

  if (originalRange) {
    selection.removeAllRanges();
    selection.addRange(originalRange);
  }

  // Get the focus back on the previously focused element, if any
  if (previouslyFocusedElement) {
    previouslyFocusedElement.focus();
  }

  return isSuccess;
}
