<template>
  <div class="editor">
    <div>
      <button @click="handlerBold">加粗</button>
      <button @click="handlerFont">修改字体</button>
      <button @click="handlerColor">修改颜色</button>
      <input type="text" placeholder="输入修改的颜色" v-model="color">
    </div>
    <div class="editor-content" contenteditable="true"></div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Watch, Emit } from "vue-property-decorator";

@Component
export default class Editor extends Vue {
  private msg: string = '';
  private color: string = '';

  private handlerBold(): void {
    document.execCommand('bold');
  }

  private handlerFont(): void {
    document.execCommand('formatBlock', false, '<h1>');
  }

  private handlerColor(): void {
    if (!this.color) {
      alert('请输入修改的颜色');
      return;
    }
    document.execCommand('ForeColor', false, this.color);

  }
}
</script>

<style>
  .editor-content {
    width: 500px;
    height: 200px;
    border: 1px solid #333;
  }
</style>