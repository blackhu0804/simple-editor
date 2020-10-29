# 简易的富文本编辑器实现

预览地址：
[点我](https://blackhu0804.github.io/simple-editor/dist/)

项目使用`Webpack`搭建`TypeScript`开发环境。

## Webpack 搭建

### 依赖安装

1. 首先第一步使用`npm init -y`快速初始化，生成完成后，目录中会生成`package.json`文件。

2. 下面我们安装`Webpack`的相关依赖

```npm
npm i webpack webpack-cli webpack-dev-server -D
```

3. 安装`ts-loader`开发依赖

这里是对 ts 文件进行解析，暂时用到的是 ts-loader，所以先安装这个 loader，其他用不上的 loader 先不装。

```npm
npm i ts-loader -D
```

4. 局部安装 `TypeScript`

```npm
npm i typescript
```

5. 安装`plugin`插件

```npm
npm i html-webpack-plugin -D
```

### webpack.config.js 配置

依赖安装完成后，我们在根目录中新建 `webpack.config.js` 文件，用于`Webpack`的配置说明。

配置文件详见，对重要部分进行了注释说明。
[点我](https://github.com/blackhu0804/simple-editor/blob/dev/webpack.config.js)

### npm scripts 配置

配置好`webpack.config.js`后，我们添加`npm scripts`进行项目启动。

```json
"scripts": {
  "dev": "webpack-dev-server --config webpack.config.js",
  "build": "webpack --config webpack.config.js"
}
```

此时我们新建`src/index.ts`，输入

```typescript
const num: Number = 1;
console.log(num);
```

执行 `npm run dev`，项目启动以后，打开`localhost:9000`，打开控制台，可以看到正常输出了，说明我们的环境配置成功了。

## Editor 实现

### 可编辑富文本的方式

使用`contenteditable` 属性

> > > `contenteditable` 是一个枚举属性，表示元素是否可被用户编辑。 如果可以，浏览器会修改元素的部件以允许编辑。

该属性必须是下面的值之一：

- true 或空字符串，表示元素是可编辑的；
- false 表示元素不是可编辑的。

### 操作富文本

如果想要通过设置来编辑内容的格式，如常规的设置标题、文字加粗、超链接等，而实现这些功能的 API 通常是`document.execCommand()`，这个方法是与富文本编辑器进行交互的主要方式。

#### 使用方法：

```javascript
bool = document.execCommand(aCommandName, aShowDefaultUI, aValueArgument);
```

返回一个 `Boolean`，如果是 `false` 则表示操作不被支持或未被启用。

#### 参数

- `aCommandName`
  一个 DOMString ，命令的名称。可用命令列表请参阅 命令 。
- `aShowDefaultUI`
  一个 Boolean， 是否展示用户界面，一般为 false。Mozilla 没有实现。
- `aValueArgument`
  一些命令（例如 insertImage）需要额外的参数（insertImage 需要提供插入 image 的 url），默认为 null。

更多的操作命令也请参考 MDN 文档，文档传送门跳转如下：

[文档传送门](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/execCommand)

### 具体实现

我们新建`src/lib/editor.ts`文件：

首先创建一个`Editor`：

```TypeScript
class Editor {
  // 保存用户选取
  private currentRange: Range | null | undefined;
  // 传入的父容器
  private editorSeletor: string;
  // 菜单DOM
  private $toolbarElem!: HTMLElement;
  // 富文本编辑器DOM
  private $textContainerElem!: HTMLElement;
  // 菜单项配置
  private config: toolConfigItem[] = []

  constructor(editorSeletor: string) {
    this.editorSeletor = editorSeletor;
  }

  /**
   * 创建富文本和菜单
   * 绑定对应事件
  */
  public create(): void {
  }

  /**
   * 将创建的富文本添加到指定DOM中
   */
  public appendEditorDom(): void {
  }

  /**
   * 为编辑区和按钮绑定对应事件
   */
  private bindEvent(): void {
  }
```

首先我们通过`create`方法，初始化我们的富文本编辑器，具体实现：

```typescript
  public create(): void {
    // 创建可编辑区域
    let dom = document.createElement('div');
    // 设置可编辑属性，样式和class
    dom.setAttribute('contenteditable', 'true');
    dom.setAttribute('style', 'width: 500px;height: 200px;border: 1px solid #333;');
    dom.setAttribute('class', 'my-editor');
    this.$textContainerElem = dom;
    // 根据config配置初始化菜单
    this.$toolbarElem = createToolBar(this.config);
    // 将创建的DOM添加到页面中
    this.appendEditorDom();
    // 绑定相应事件
    this.bindEvent();
  }
```

`createToolBar`方法初始化菜单实现：

```typescript
function createToolBar(config: toolConfigItem[]): HTMLElement {
  let toolBar = document.createElement("div");
  toolBar.id = "toolBar";
  toolBar.setAttribute("style", "width: 500px;margin: 0 auto;");

  config.forEach((configItem) => {
    let item = document.createElement("button");
    item.textContent = configItem.name;
    toolBar.appendChild(item);
    item.dataset.command = configItem.command;
    item.dataset.params = configItem.params;
  });

  return toolBar;
}
```

菜单和编辑区事件绑定：

```typescript
private bindEvent(): void {
  // 替换回车
  this.$textContainerElem.onkeydown = (e) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    document.execCommand("insertHTML", false, `<br></br>`);
  }

  // 操作按钮绑定事件
  let toolBar = document.getElementById('toolBar');
  for (let i = 0; i < (toolBar?.children as HTMLCollection).length; i++) {
    let button: HTMLElement = toolBar?.children[i] as HTMLElement;
    const { command, params } = button.dataset;
    button.addEventListener('click', () => {
      this.doCommand(command, params);
    });
  }
}
```

上面几个函数就是我们比较核心的实现，全部源码可以直接查看对应的文件。

### 选中优化

上面我们列了几个函数的核心实现，但是存在一个缺陷，如果选中内容在点击菜单时失焦的话，会导致操作失败，所以我们要在用户失焦的时候保存用户的选区，在进行菜单操作的时候，恢复用户的上一次选区。

```typescript
  /**
   * 保存选区
   */
  private saveRange(): void {
    const selection = document.getSelection() as Selection;
    if (selection && selection.rangeCount === 0) {
      return;
    }
    this.currentRange = selection.getRangeAt(0);
  }

  /**
   * 存储选区
   */
  public restoreRange(): void {
    const selection = document.getSelection() as Selection;
    if (selection && this.currentRange) {
      selection.removeAllRanges();
      selection.addRange(this.currentRange);
    }
  }
```

然后给输入区绑定`blur`事件进行选区的保存：

```typescript
private bindEvent(): void {
  // 失焦时保存range
+ this.$textContainerElem.onblur = () => {
+   this.saveRange();
+ }
...
}
```

优化以后，即使用户在失焦的情况下，点击菜单的相关操作，也能对上一次的选中内容进行操作了。

这样的话，我们的一个简易的富文本编辑器就实现了！
