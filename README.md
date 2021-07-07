[![Build Status](https://github.com/sourabhv/range-interpolator/actions/workflows/main.yml/badge.svg)](https://github.com/sourabhv/range-interpolator/actions/workflows/main.yml)
[![NPM Version](https://badge.fury.io/js/range-interpolator.svg)](https://badge.fury.io/js/range-interpolator)
[![Dependencies](https://status.david-dm.org/gh/sourabhv/range-interpolator.svg)](https://david-dm.org/sourabhv/range-interpolator)
[![Dev Dependencies](https://david-dm.org/sourabhv/range-interpolator/dev-status.svg)](https://david-dm.org/sourabhv/range-interpolator#info=devDependencies)

# Range Interpolator

A simple range interpolator module, derived from [react-native](https://github.com/facebook/react-native)
source code, that construct a given value from input range to output range, with support for easing and extrapolation.


## Installation

You can install this package using NPM:

```sh
npm i range-interpolator --save
```
or

```sh
yarn add range-interpolator
```

## How use

Simple example JavaScript / TypeScript:

```JavaScript
import { createInterpolator } from "range-interpolator";

const interpolator = createInterpolator({
    inputRange: [0, 1],
    outputRange: [100, 200],
});

interpolator(0) // -> 100
interpolator(0.5) // -> 150
interpolator(0.8) // -> 180
interpolator(1) // -> 200
```

```JavaScript
import { createInterpolator } from "range-interpolator";

const interpolator = createInterpolator({
    inputRange: [0, 10, 10],
    outputRange: [1, 2, 3],
    extrapolate: 'extend',
});

interpolator(0) // -> 1
interpolator(5) // -> 1.5
interpolator(10) // -> 2
interpolator(10.1) // -> 3
interpolator(15) // -> 3
```

Checkout [more use cases](src/range-interpolator.spec.ts)

## Unit testing

For run unit tests, use:

```
yarn test
```

All unit test report you can find at `report/` folder.

For run test at watch mode, use:

```
yarn test:dev
```


## Linting

For check eslint rules, use:

```
yarn lint
```

For auto fix all eslint bugs, use:

```
yarn lint:fix
```


## License
Except where noted otherwise, files are licensed under the ISC License.
