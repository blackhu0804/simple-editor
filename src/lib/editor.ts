import {createToolBar} from './renderTool';

interface toolConfigItem {
  name: string,
  command: string,
  params?: string
}

class Editor {
  private currentRange: Range | null | undefined;
  private editorSeletor: string;
  private $toolbarElem!: HTMLElement;
  private $textContainerElem!: HTMLElement;

  private config: toolConfigItem[] = [
    {
      name: '加粗',
      command: 'bold'
    },
    {
      name: '一级标题',
      command: 'formatblock',
      params: 'h1'
    },
    {
      name: '二级标题',
      command: 'formatblock',
      params: 'h2'
    },
    {
      name: '三级标题',
      command: 'formatblock',
      params: 'h3'
    },
    {
      name: '变红',
      command: 'forecolor',
      params: 'red'
    }
  ]

  constructor(editorSeletor: string) {
    this.editorSeletor = editorSeletor;
  }
  
  public create(): void {
    let dom = document.createElement('div');
    dom.setAttribute('contenteditable', 'true');
    dom.setAttribute('style', 'width: 500px;height: 200px;border: 1px solid #333;');
    dom.setAttribute('class', 'my-editor');
    this.$textContainerElem = dom;

    this.$toolbarElem = createToolBar(this.config);

    this.appendEditorDom();

    this.bindEvent();
  }

  public appendEditorDom(): void {
    console.log(this.editorSeletor);
    if (this.editorSeletor) {
      document.querySelectorAll(this.editorSeletor)[0].append(this.$toolbarElem);
      document.querySelectorAll(this.editorSeletor)[0].append(this.$textContainerElem);
    } else {
      document.body.append(this.$toolbarElem);
      document.body.append(this.$textContainerElem);
    }
  }

  /**
   * 为编辑区和按钮绑定对应事件
   */
  private bindEvent(): void {
    // 失焦时保存range
    this.$textContainerElem.onblur = () => {
      this.saveRange();
    }

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

  /**
   * 执行execCommand
   * @param command 
   * @param value 
   */
  private doCommand(command: string | undefined, value: string | undefined): void {
    if (!command) return;

    this.restoreRange();
    document.execCommand(command, false, value);
  }
}

export default Editor;
