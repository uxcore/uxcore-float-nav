## uxcore-float-nav

React float nav

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test Coverage][coveralls-image]][coveralls-url]
[![Dependency Status][dep-image]][dep-url]
[![devDependency Status][devdep-image]][devdep-url] 
[![NPM downloads][downloads-image]][npm-url]

[![Sauce Test Status][sauce-image]][sauce-url]

[npm-image]: http://img.shields.io/npm/v/uxcore-float-nav.svg?style=flat-square
[npm-url]: http://npmjs.org/package/uxcore-float-nav
[travis-image]: https://img.shields.io/travis/uxcore/uxcore-float-nav.svg?style=flat-square
[travis-url]: https://travis-ci.org/uxcore/uxcore-float-nav
[coveralls-image]: https://img.shields.io/coveralls/uxcore/uxcore-float-nav.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/uxcore/uxcore-float-nav?branch=master
[dep-image]: http://img.shields.io/david/uxcore/uxcore-float-nav.svg?style=flat-square
[dep-url]: https://david-dm.org/uxcore/uxcore-float-nav
[devdep-image]: http://img.shields.io/david/dev/uxcore/uxcore-float-nav.svg?style=flat-square
[devdep-url]: https://david-dm.org/uxcore/uxcore-float-nav#info=devDependencies
[downloads-image]: https://img.shields.io/npm/dm/uxcore-float-nav.svg
[sauce-image]: https://saucelabs.com/browser-matrix/uxcore-float-nav.svg
[sauce-url]: https://saucelabs.com/u/uxcore-float-nav


### Development

```sh
git clone https://github.com/uxcore/uxcore-float-nav
cd uxcore-float-nav
npm install
npm run server
```

if you'd like to save your install time，you can use uxcore-tools globally.

```sh
npm install uxcore-tools -g
git clone https://github.com/uxcore/uxcore-float-nav
cd uxcore-float-nav
npm install
npm run dep
npm run start
```

### Test Case

```sh
npm run test
```

### Coverage

```sh
npm run coverage
```

## Demo

http://uxcore.github.io/components/float-nav

## Contribute

Yes please! See the [CONTRIBUTING](https://github.com/uxcore/uxcore/blob/master/CONTRIBUTING.md) for details.

## API

## Props

### FloatNavWrapper

With content wrapper.

| Name | Type | Required | Default | Comments |
|---|---|---|---|---|
|prefixCls|string|no|'uxcore-float-nav'|prefix classname for component|
|className|string|no|''|custom classname for component|
|showOrderNumber|boolean|no|true|prepend order index to the nav item|
|width|number|no|260|nav's width|
|height|number|no|370|nav's height|
|offset|object|no|{right: 20, bottom: 20}|nav's position offset|
|content|react element|yes|null|place the content with anchor here|
|stepLength|number|no|50|scroll length|
|hoverable|boolean|no|false|enable the haverable feature

### FloatNav

Without content wrapper.

| Name | Type | Required | Default | Comments |
|---|---|---|---|---|
|prefixCls|string|no|'uxcore-float-nav'|prefix classname for component|
|className|string|no|''|custom classname for component|
|showOrderNumber|boolean|no|true|prepend order index to the nav item|
|width|number|no|260|nav's width|
|height|number|no|370|nav's height|
|offset|object|no|{right: 20, bottom: 20}|nav's position offset|
|stepLength|number|no|50|scroll length|

### NavItem

| Name | Type | Required | Default | Comments |
|---|---|---|---|---|
|title|react element or string|yes|''|nav item's title|
|anchor|string|yes|''|define the anchor|
|onClick|function|no|noop|trigger when nav item is clicked with two parameter(anchor, orderNumber)|
