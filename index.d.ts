interface Routes {
    [path: string]: Function;
}
export default class HashRouter {
    private readonly emitter;
    private readonly router;
    private readonly window;
    static urlify(str: string): string;
    go(uri: any): void;
    get(): string;
    private applyChange;
    start(): void;
    addRoute(path: string, callable: Function): void;
    started: Promise<void>;
    private resolveStart;
    constructor(routes?: Routes, win?: Window);
    destroy(): void;
    on(action: string, cb: Function): void;
    once(action: string, cb: Function): void;
    off(action: string, cb?: Function): void;
}
export {};
