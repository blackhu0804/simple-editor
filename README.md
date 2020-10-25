# 简易的富文本编辑器雏形实现

预览地址：
[点我](https://blackhu0804.github.io/simple-editor/dist/)

首先项目直接使用 `vue-cli` 快速搭建简易开发环境，使用 `Vue + TypeScript` 进行开发。


## 可编辑富文本的方式

使用`contenteditable` 属性

>>> `contenteditable` 是一个枚举属性，表示元素是否可被用户编辑。 如果可以，浏览器会修改元素的部件以允许编辑。

该属性必须是下面的值之一：

- true 或空字符串，表示元素是可编辑的；
- false 表示元素不是可编辑的。

```html
<div class="editor-content"contenteditable="true"></div>
```

这就实现了最简单的输入功能。

## 操作富文本

如果想要通过设置来编辑内容的格式，如常规的设置标题、文字加粗、超链接等，而实现这些功能的API通常是`document.execCommand()`，这个方法是与富文本编辑器进行交互的主要方式。

### 使用方法：

```javascript
bool = document.execCommand(aCommandName, aShowDefaultUI, aValueArgument)
```

返回一个 `Boolean`，如果是 `false` 则表示操作不被支持或未被启用。

#### 参数

- `aCommandName`
一个 DOMString ，命令的名称。可用命令列表请参阅 命令 。
- `aShowDefaultUI`
一个 Boolean， 是否展示用户界面，一般为 false。Mozilla 没有实现。
- `aValueArgument`
一些命令（例如insertImage）需要额外的参数（insertImage需要提供插入image的url），默认为null。


更多的操作命令也请参考 MDN 文档，文档传送门跳转如下：

[文档传送门](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/execCommand)

## 具体实现

了解完需要使用的API以后，去实现我们最简单的富文本编辑器功能也就变得容易了。

```html
  <div class="editor">
    <div>
      <button @click="handlerBold">加粗</button>
      <button @click="handlerFont('h1')">一级标题</button>
      <button @click="handlerFont('h2')">二级标题</button>
      <button @click="handlerFont('h3')">三级标题</button>
      <input type="color" @change="handlerColor($event.target.value)" class="color-picker">
    </div>
    <div class="editor-content" contenteditable="true" 
      @keydown.enter.prevent="preventEnter($event)"
      @blur="saveRange"
    ></div>
  </div>
```

首先我们添加三个操作按钮，分别绑定对应的方法，分别去实现我们需要的功能。也就是通过我们上面提到过得`document.execCommand()`方法去实现。

```typescript
  private handlerBold(): void {
    this.doCommand('bold', '');
  }

  private handlerFont(value: string): void {
    this.doCommand('formatBlock', value);
  }

  private handlerColor(value: string): void {
    this.doCommand('ForeColor', value);
  }

  private doCommand(command: string, value: string): void {
    document.execCommand(command, false, value);
  }
```

三个对应的方法实现我们加粗、修改字体、修改颜色三个简单的富文本功能。

## 进一步扩展

此时如果在选中内容后，点击非编辑块内容区域，再去点击菜单，功能没有正常执行。因为`document.execCommand()`只对选中的内容进行操作，所以我们要对用户操作的内容选区进行保存，所以我们使用`selection.getRangeAt()`获得用户的选取，进行临时的存储。

所以我们在编辑区域失焦的时候进行用户选区的保存操作：

```typescript
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
```

并且在进行菜单操作的时候，将存储的选区进行恢复，然后再对选区的内容进行操作，便实现了我们想要的内容：
```typescript
  private doCommand(command: string, value: string): void {
    this.restoreRange();
    document.execCommand(command, false, value);
  }
```

这样的话，我们的一个简易的富文本编辑器就实现了！