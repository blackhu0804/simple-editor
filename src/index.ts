class Editor {
  private currentRange: Range | null | undefined;
  private editorSeletor: string;
  // private $toolbarElem: HTMLElement;
  private $textContainerElem!: HTMLElement;

  constructor(editorSeletor: string) {
    this.editorSeletor = editorSeletor;
  }

  createEditorDom() {
    let dom = document.createElement('div');
    dom.setAttribute('contenteditable', 'true');
    dom.setAttribute('style', 'width: 300px;height: 200px;border: 1px solid #333;');
    this.$textContainerElem = dom;
  }

  appendEditorDom() {
    document.querySelectorAll(this.editorSeletor)[0].append(this.$textContainerElem);
  }
}

export default Editor;


console.log('editor')