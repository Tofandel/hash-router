import * as test from "tape"
// @ts-ignore
import HashRouter from "../index.ts"

class HashChangeEvent extends Event {
  oldURL;
  newURL;
  constructor(type, dict: HashChangeEventInit) {
    super(type);
    this.oldURL = dict.oldURL;
    this.newURL = dict.newURL;
  }
}

global.window = DocumentShim() as Window & typeof globalThis;

test("HashRouter is a class", function (assert) {
  assert.equal(typeof HashRouter, "function")
  assert.doesNotThrow(() => {
    new HashRouter()
  })
  assert.end()
})

test("RemoveHash", function (assert) {
  assert.equal(HashRouter.urlify(null), null);
  assert.equal(HashRouter.urlify("abc"), "/abc");
  assert.equal(HashRouter.urlify("/abc"), "/abc");
  assert.equal(HashRouter.urlify("*"), "*");
  assert.equal(HashRouter.urlify("#abc"), "/abc");
  assert.end()
})

test("HashRouter set's route", function (assert) {
  const document = DocumentShim();
  const router = new HashRouter(null, document);

  router.go("/foo")

  assert.equal(document.location.hash, "#/foo")

  router.destroy()
  assert.end()
})

test("HashRouter broadcasts initial route when called", async function (assert) {
  const document = DocumentShim()

  const router = new HashRouter(null, document);

  router.addRoute("/", function (hash, opts) {
    assert.equal(hash, "/")
    assert.deepEqual(opts, {
      params: {},
      splats: [],
      route: '/',
      newURL: "/",
      oldURL: null
    })

    assert.end()
  })
  await router.started;

  router.destroy()
})

test("HashRouter broadcasts deltas in routes", async function (assert) {
  const document = DocumentShim("#/foo")
  const router = new HashRouter({
    '/bar': (hash, opts) => {
      assert.equal(hash, "/bar")
      assert.deepEqual(opts, {
        params: {},
        splats: [],
        route: '/bar',
        newURL: "/bar",
        oldURL: "/foo"
      })

      assert.end()
    }
  }, document)

  await router.started;

  document.location.hash = "#/bar";

  router.destroy()
})

test("HashRouter deals with no hash in previous route", async function (assert) {
  const document = DocumentShim()
  const router = new HashRouter({
    bar: (hash, opts) => {
      assert.equal(hash, "/bar")
      assert.deepEqual(opts, {
        params: {},
        splats: [],
        route: '/bar',
        newURL: '/bar',
        oldURL: '/'
      });
      assert.end()
    }
  }, document)
  await router.started;

  document.location.hash = '#/bar';

  router.destroy()
})

test("HashRouter deals with no hash in new route", async function (assert) {
  const document = DocumentShim("#/foo")
  const router = new HashRouter(null, document)

  router.addRoute("*", function (hash, opts) {
    if (hash === "/foo") {
      return
    }

    assert.equal(hash, "/")
    assert.deepEqual(opts, {
      params: {},
      splats: ["/"],
      route: '*',
      newURL: '/',
      oldURL: '/foo'
    })

    assert.end()
  })
  await router.started;

  document.location.hash = "#";

  router.destroy()
})

test("Events", (assert) => {
  const document = DocumentShim("#/foo")
  const router = new HashRouter({
    '/bar': () => {}
  }, document);

  assert.plan(3);

  router.on('not-found', () => {
    assert.equal('not-found', false)
  })
  router.off('not-found');
  router.on('not-found', () => {
    assert.equal('not-found', 'not-found') // 2
  })
  router.once('routed', () => {
    assert.equal('routed', 'routed') // 1
  })

  router.start() // not found

  document.location.hash = '#/bar'; // found once
  document.location.hash = ''; // not found again
  document.location.hash = '#/bar'; // already found

  router.destroy()
})

function DocumentShim(uri = "#"): Window {
  const shim = new EventTarget() as any;
  shim.location = { href: "https://example.com/" };

  let hash = uri;
  Object.defineProperty(shim.location, 'hash', {
    get: () => {
      return hash === "#" ? "" : hash;
    },
    set: (v) => {
      if (v[0] !== "#") {
        v = "#" + v;
      }
      if (hash !== v) {
        const evt = new Event("hashchange") as HashChangeEvent;
        evt.newURL = shim.location.href + v;
        evt.oldURL = shim.location.href + hash;
        shim.dispatchEvent(evt);
        hash = v;
      }
    }
  })
  return shim;
}
