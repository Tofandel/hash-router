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

