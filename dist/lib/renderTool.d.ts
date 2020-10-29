interface toolConfigItem {
    name: string;
    command: string;
    params?: string;
}
export declare function createToolBar(config: toolConfigItem[]): HTMLElement;
export {};
