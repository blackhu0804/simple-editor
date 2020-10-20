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
      <button @click="handlerFont">修改字体</button>
      <button @click="handlerColor">修改颜色</button>
      <input type="text" placeholder="输入修改的颜色" v-model="color" />
    </div>
    <div class="editor-content" contenteditable="true"></div>
  </div>
```

首先我们添加三个操作按钮，分别绑定对应的方法，分别去实现我们需要的功能。也就是通过我们上面提到过得`document.execCommand()`方法去实现。

```typescript
private handlerBold(): void {
  document.execCommand("bold");
}

private handlerFont(): void {
  document.execCommand("formatBlock", false, "<h1>");
}

private handlerColor(): void {
  if (!this.color) {
    alert("请输入修改的颜色");
    return;
  }
  document.execCommand("ForeColor", false, this.color);
}
```

三个对应的方法实现我们加粗、修改字体、修改颜色三个简单的富文本功能。

以上，只算上对富文本编辑器的基本知识点进行了初步的梳理，后续还需要继续完善。