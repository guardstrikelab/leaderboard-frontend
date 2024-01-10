<template>
  <div class="editor">
    <Toolbar style="border-bottom: 1px solid #434d60" :editor="editorRef" :defaultConfig="toolbarConfig" mode="default" />
    <Editor
      style="height: 140px; overflow-y: hidden"
      :model-value="modelValue"
      @update:model-value="(newValue) => $emit('update:modelValue', newValue)"
      :defaultConfig="editorConfig"
      mode="simple"
      @onCreated="handleCreated" />
  </div>
</template>

<script setup>
import '@wangeditor/editor/dist/css/style.css'; // 引入 css
import { i18nChangeLanguage, DomEditor } from '@wangeditor/editor';
import { onBeforeMount, onBeforeUnmount, ref, shallowRef } from 'vue';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import { useI18n } from 'vue-i18n';

defineProps(['modelValue']);
defineEmits(['update:modelValue']);

const editorRef = shallowRef();
const { locale } = useI18n();

const toolbarConfig = {
  excludeKeys: ['group-more-style', 'emotion', 'insertLink', 'insertImage', 'group-video', 'insertVideo', 'divider', 'fullScreen'],
};
const editorConfig = {
  placeholder: '',
  maxLength: 5000,
  MENU_CONF: {
    uploadImage: {
      server: import.meta.env.VITE_APP_BASE_API + '/api/web/upload_image/',
      fieldName: 'image',
      maxFileSize: 5 * 1024 * 1024, // 5M
      maxNumberOfFiles: 100,
      headers: {
        Authorization: `Token ${localStorage.getItem('Admin-Token')}`,
      },
      onError: (file, err, res) => {
        ElMessage.error(err.message);
      },
      customInsert(res, insertFn) {
        insertFn(res.image_url);
      },
    },
  },
};
onBeforeMount(() => {
  if (locale.value == 'zh') {
    i18nChangeLanguage('zh-CN');
  } else {
    i18nChangeLanguage('en');
  }
});

onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});

const handleCreated = (editor) => {
  editorRef.value = editor; // 记录editor实例
  // setTimeout(() => {
  //   const toolbar = DomEditor.getToolbar(editor);
  //   let keys = toolbar.getConfig().toolbarKeys;
  //   console.log('keys', keys);
  // }, 2000);
};
</script>

<style lang="scss" scoped>
.editor {
  --w-e-textarea-bg-color: #343c4d;
  --w-e-textarea-color: #fff;
  --w-e-toolbar-active-bg-color: #4562e3;
  --w-e-toolbar-bg-color: #343c4d;
  --w-e-toolbar-color: #fff;
  --w-e-textarea-slight-bg-color: #ccc;
  --w-e-modal-button-bg-color: #4562e3;
  --w-e-toolbar-border-color: #3f4e63;
  width: 100%;
  :deep(.w-e-menu-tooltip-v5) {
    &:before {
      background-color: #3f4e67;
      color: var(--w-e-textarea-color);
    }
  }
}
</style>
