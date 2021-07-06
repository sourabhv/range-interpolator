import { invariant } from './invariant';
import {
  ExtrapolateType,
  Interpolator,
  InterpolationConfigType,
} from './range-interpolator.d';

const linear = (t: any) => t;

export function createInterpolation(
  config: InterpolationConfigType,
): Interpolator {
  console.log(typeof invariant);

  const outputRange = config.outputRange;
  checkInfiniteRange('outputRange', outputRange);

  const inputRange = config.inputRange;
  checkInfiniteRange('inputRange', inputRange);
  checkValidInputRange(inputRange);

  invariant(
    inputRange.length === outputRange.length,
    'inputRange (' +
      inputRange.length +
      ') and outputRange (' +
      outputRange.length +
      ') must have the same length',
  );

  const easing = config.easing || linear;

  let extrapolateLeft: ExtrapolateType = 'extend';
  if (config.extrapolateLeft !== undefined) {
    extrapolateLeft = config.extrapolateLeft;
  } else if (config.extrapolate !== undefined) {
    extrapolateLeft = config.extrapolate;
  }

  let extrapolateRight: ExtrapolateType = 'extend';
  if (config.extrapolateRight !== undefined) {
    extrapolateRight = config.extrapolateRight;
  } else if (config.extrapolate !== undefined) {
    extrapolateRight = config.extrapolate;
  }

  return (input) => {
    invariant(
      typeof input === 'number',
      'Cannot interpolation an input which is not a number',
    );

    const range = findRange(input, inputRange);
    return interpolate(
      input,
      inputRange[range],
      inputRange[range + 1],
      outputRange[range],
      outputRange[range + 1],
      easing,
      extrapolateLeft,
      extrapolateRight,
    );
  };
}

function interpolate(
  input: number,
  inputMin: number,
  inputMax: number,
  outputMin: number,
  outputMax: number,
  // eslint-disable-next-line no-unused-vars
  easing: (input: number) => number,
  extrapolateLeft: ExtrapolateType,
  extrapolateRight: ExtrapolateType,
) {
  let result = input;

  // Extrapolate
  if (result < inputMin) {
    if (extrapolateLeft === 'identity') {
      return result;
    } else if (extrapolateLeft === 'clamp') {
      result = inputMin;
    } else if (extrapolateLeft === 'extend') {
      // noop
    }
  }

  if (result > inputMax) {
    if (extrapolateRight === 'identity') {
      return result;
    } else if (extrapolateRight === 'clamp') {
      result = inputMax;
    } else if (extrapolateRight === 'extend') {
      // noop
    }
  }

  if (outputMin === outputMax) {
    return outputMin;
  }

  if (inputMin === inputMax) {
    if (input <= inputMin) {
      return outputMin;
    }
    return outputMax;
  }

  // Input Range
  if (inputMin === -Infinity) {
    result = -result;
  } else if (inputMax === Infinity) {
    result = result - inputMin;
  } else {
    result = (result - inputMin) / (inputMax - inputMin);
  }

  // Easing
  result = easing(result);

  // Output Range
  if (outputMin === -Infinity) {
    result = -result;
  } else if (outputMax === Infinity) {
    result = result + outputMin;
  } else {
    result = result * (outputMax - outputMin) + outputMin;
  }

  return result;
}

function findRange(input: number, inputRange: number[]) {
  let i: number;
  for (i = 1; i < inputRange.length - 1; ++i) {
    if (inputRange[i] >= input) {
      break;
    }
  }
  return i - 1;
}

function checkValidInputRange(arr: number[]) {
  invariant(arr.length >= 2, 'inputRange must have at least 2 elements');
  for (let i = 1; i < arr.length; ++i) {
    invariant(
      arr[i] >= arr[i - 1],
      'inputRange must be monotonically non-decreasing ' + arr,
    );
  }
}

function checkInfiniteRange(name: string, arr: number[]) {
  invariant(arr.length >= 2, name + ' must have at least 2 elements');
  invariant(
    arr.length !== 2 || arr[0] !== -Infinity || arr[1] !== Infinity,
    name + 'cannot be ]-infinity;+infinity[ ' + arr,
  );
}
