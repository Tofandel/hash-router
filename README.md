# @tofandel/hash-router

A frontend router for the hash change event

## Example

```js
import HashRouter from "@tofandel/hash-router";

const router = new HashRouter({
  '/': renderHome,
  '/login': showLoginDialog,
  '*': fallbackRoute
})
router.on("routed", function (hash, event) {
  console.log("Route has changed!", hash, event)
})
router.on("not-found", function (hash, event) {
  console.log("Didn't find a route", hash, event) // This won't ever fire if the '*' route is set
})

router.started.then(() => {
  console.log('Router is ready');
})
```

## Installation

`npm install @tofandel/hash-router`

  [1]: https://secure.travis-ci.org/Raynos/hash-router.png
  [2]: https://travis-ci.org/Raynos/hash-router
  [3]: https://david-dm.org/Raynos/hash-router.png
  [4]: https://david-dm.org/Raynos/hash-router
  [5]: https://ci.testling.com/Raynos/hash-router.png
  [6]: https://ci.testling.com/Raynos/hash-router
  [7]: https://badge.fury.io/js/hash-router.png
  [8]: https://badge.fury.io/js/hash-router
  [9]: https://coveralls.io/repos/Raynos/hash-router/badge.png
  [10]: https://coveralls.io/r/Raynos/hash-router
  [11]: https://gemnasium.com/Raynos/hash-router.png
  [12]: https://gemnasium.com/Raynos/hash-router
