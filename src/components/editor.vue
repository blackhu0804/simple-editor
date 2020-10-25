<template>
  <div class="editor">
    <div>
      <button @click="handlerBold">加粗</button>
      <button @click="handlerFont('h1')">一级标题</button>
      <button @click="handlerFont('h2')">二级标题</button>
      <button @click="handlerFont('h3')">三级标题</button>
      <input
        type="color"
        @change="handlerColor($event.target.value)"
        class="color-picker"
      />
    </div>
    <div
      class="editor-content"
      contenteditable="true"
      @keydown.enter.prevent="preventEnter($event)"
      @blur="saveRange"
    ></div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Watch, Emit } from "vue-property-decorator";

@Component
export default class Editor extends Vue {
  private msg: string = "";
  private range: Range | null = null;

  private handlerBold(): void {
    this.doCommand("bold", "");
  }

  private handlerFont(value: string): void {
    this.doCommand("formatBlock", value);
  }

  private handlerColor(value: string): void {
    this.doCommand("ForeColor", value);
  }

  private doCommand(command: string, value: string): void {
    this.restoreRange();
    document.execCommand(command, false, value);
  }

  /**
   * 保存选区
   */
  private saveRange(): void {
    const selection = document.getSelection() as Selection;
    if (selection && selection.rangeCount === 0) {
      return;
    }
    this.range = selection.getRangeAt(0);
  }

  /**
   * 存储选区
   */
  public restoreRange(): void {
    const selection = document.getSelection() as Selection;
    if (selection && this.range) {
      selection.removeAllRanges();
      selection.addRange(this.range);
    }
  }

  preventEnter(e: Event) {
    document.execCommand("insertHTML", false, `<br></br>`);
  }
}
</script>

<style>
.editor-content {
  width: 500px;
  height: 200px;
  border: 1px solid #333;
}
.editor-content:focus {
  outline: none;
}
.color-picker {
  vertical-align: middle;
}
</style>