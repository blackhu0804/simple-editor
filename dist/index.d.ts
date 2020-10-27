declare class Editor {
    private currentRange;
    private editorSeletor;
    private $textContainerElem;
    constructor(editorSeletor: string);
    createEditorDom(): void;
    appendEditorDom(): void;
}
