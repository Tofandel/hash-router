"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var routes_1 = require("routes");
var tiny_emitter_1 = require("tiny-emitter");
var HashRouter = (function () {
    function HashRouter(routes, win) {
        var _this = this;
        if (routes === void 0) { routes = null; }
        this.emitter = new tiny_emitter_1.TinyEmitter();
        this.router = routes_1.Router();
        this.started = null;
        this.window = win || (typeof window === "object" && window);
        if (routes) {
            Object.keys(routes).forEach(function (path) {
                _this.addRoute(path, routes[path]);
            });
        }
        this.started = new Promise(function (resolve) {
            _this.resolveStart = resolve;
        });
        this.window && setTimeout(function () { return _this.start(); }, 1);
        this.window && this.window.addEventListener("hashchange", this.applyChange.bind(this));
    }
    HashRouter.urlify = function (str) {
        if (str && str[0] === "#")
            str = str.slice(1);
        if (str && str[0] !== "/") {
            str = "/" + str;
        }
        return typeof str === "string" ? str || '/' : str;
    };
    ;
    HashRouter.prototype.go = function (uri) {
        this.window.location.hash = "#" + uri;
    };
    HashRouter.prototype.get = function () {
        return HashRouter.urlify(this.window.location.hash);
    };
    HashRouter.prototype.applyChange = function (event) {
        var newURL;
        var oldURL = null;
        if (event) {
            newURL = new URL(event.newURL).hash;
            oldURL = new URL(event.oldURL).hash;
        }
        else {
            newURL = this.get();
        }
        newURL = HashRouter.urlify(newURL);
        oldURL = HashRouter.urlify(oldURL);
        var route = this.router.match(newURL);
        if (route) {
            route.fn(newURL, {
                params: route.params,
                splats: route.splats,
                route: route.route,
                newURL: newURL,
                oldURL: oldURL
            });
        }
        this.emitter.emit(route ? "routed" : "not-found", {
            newURL: newURL,
            oldURL: oldURL,
            route: route
        });
    };
    HashRouter.prototype.start = function () {
        this.resolveStart();
        this.applyChange();
    };
    HashRouter.prototype.addRoute = function (path, callable) {
        this.router.addRoute(path, callable);
    };
    HashRouter.prototype.destroy = function () {
        this.window && this.window.removeEventListener("hashchange", this.applyChange);
    };
    HashRouter.prototype.on = function (action, cb) {
        this.emitter.on(action, cb);
    };
    HashRouter.prototype.once = function (action, cb) {
        this.emitter.once(action, cb);
    };
    HashRouter.prototype.off = function (action, cb) {
        this.emitter.off(action, cb);
    };
    return HashRouter;
}());
exports.default = HashRouter;
