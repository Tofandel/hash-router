import {Router} from "routes";
import {TinyEmitter} from "tiny-emitter";

interface Routes {
    [path: string]: Function,
}

export default class HashRouter {
    private readonly emitter = new TinyEmitter();
    private readonly router = Router();
    private readonly window;

    static urlify(str: string) {
        if (str && str[0] === "#")
            str = str.slice(1)

        if (str && str[0] !== "/" && str[0] !== "*") {
            str = "/" + str
        }
        return typeof str === "string" ? str || '/' : str;
    };

    go(uri) {
        this.window.location.hash = "#" + HashRouter.urlify(uri);
    }

    get() {
        return HashRouter.urlify(this.window.location.hash);
    }

    private applyChange(event?: HashChangeEvent) {
        let newURL;
        let oldURL = null;

        if (event) {
           newURL = new URL(event.newURL).hash;

            oldURL = new URL(event.oldURL).hash;
        } else {
            newURL = this.get();
        }

        newURL = HashRouter.urlify(newURL);
        oldURL = HashRouter.urlify(oldURL);

        if (newURL !== oldURL) {
            const route = this.router.match(newURL)
            if (route) {
                route.fn(newURL, {
                    params: route.params,
                    splats: route.splats,
                    route: route.route,
                    newURL,
                    oldURL
                });
            }
            this.emitter.emit(route ? "routed" : "not-found", {
                newURL, oldURL, route
            });
        }
    }

    start() {
        this.resolveStart();
        this.applyChange();
    }

    addRoute(path: string, callable: Function) {
        this.router.addRoute(HashRouter.urlify(path), callable);
    }

    started: Promise<void> = null;
    private resolveStart: (value: (PromiseLike<void> | void)) => void

    constructor(routes: Routes = null, win?: Window) {
        this.window = win || (typeof window === "object" && window);

        if (routes) {
            Object.keys(routes).forEach((path) => {
                this.addRoute(path, routes[path]);
            });
        }
        this.started = new Promise((resolve) => {
            this.resolveStart = resolve
        });
        this.window && setTimeout(() => this.start(), 1);

        this.window && this.window.addEventListener("hashchange", this.applyChange.bind(this));
    }

    destroy() {
        this.window && this.window.removeEventListener("hashchange", this.applyChange);
    }

    on(action: string, cb: Function) {
        this.emitter.on(action, cb);
    }

    once(action: string, cb: Function) {
        this.emitter.once(action, cb);
    }

    off(action: string, cb?: Function) {
        this.emitter.off(action, cb);
    }
}

