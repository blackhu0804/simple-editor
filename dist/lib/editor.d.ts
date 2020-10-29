declare class Editor {
    private currentRange;
    private editorSeletor;
    private $toolbarElem;
    private $textContainerElem;
    private config;
    constructor(editorSeletor: string);
    create(): void;
    appendEditorDom(): void;
    /**
     * 为编辑区和按钮绑定对应事件
     */
    private bindEvent;
    /**
     * 保存选区
     */
    private saveRange;
    /**
     * 存储选区
     */
    restoreRange(): void;
    /**
     * 执行execCommand
     * @param command
     * @param value
     */
    private doCommand;
}
export default Editor;
