# @tofandel/hash-router

[![Build](https://github.com/Tofandel/hash-router/actions/workflows/test.yml/badge.svg)](https://github.com/Tofandel/hash-router/actions)
![coverage](https://img.shields.io/badge/Coverage-100%25-brightgreen.svg?style=flat)
[![npm version](https://badge.fury.io/js/@tofandel%2Fhash-router.svg)](https://www.npmjs.com/package/@tofandel/hash-router)
[![dependencies](https://status.david-dm.org/gh/tofandel/hash-router.svg)](https://david-dm.org/tofandel/hash-router)

A frontend router for the hash change event

## Example

```js
import HashRouter from "@tofandel/hash-router";

const router = new HashRouter({
  '/': renderHome,
  '/login': showLoginDialog,
  '*': fallbackRoute
})
router.addRoute('/another', anotherRouteCb);

router.on("routed", function (hash, event) {
  console.log("Route has changed!", hash, event)
})
router.on("not-found", function (hash, event) {
  console.log("Didn't find a route", hash, event) // This won't ever fire if the '*' route is set
})

router.started.then(() => {
  console.log('Router is ready');
  router.go('/login');
})
```

## Installation

`npm install @tofandel/hash-router`

