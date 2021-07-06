import { createInterpolation } from './range-interpolator';
import Easing from 'easing-functions';

describe('Interpolation', () => {
  it('should work with defaults', () => {
    const interpolation = createInterpolation({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });

    expect(interpolation(0)).toBe(0);
    expect(interpolation(0.5)).toBe(0.5);
    expect(interpolation(0.8)).toBe(0.8);
    expect(interpolation(1)).toBe(1);
  });

  it('should work with output range', () => {
    const interpolation = createInterpolation({
      inputRange: [0, 1],
      outputRange: [100, 200],
    });

    expect(interpolation(0)).toBe(100);
    expect(interpolation(0.5)).toBe(150);
    expect(interpolation(0.8)).toBe(180);
    expect(interpolation(1)).toBe(200);
  });

  it('should work with input range', () => {
    const interpolation = createInterpolation({
      inputRange: [100, 200],
      outputRange: [0, 1],
    });

    expect(interpolation(100)).toBe(0);
    expect(interpolation(150)).toBe(0.5);
    expect(interpolation(180)).toBe(0.8);
    expect(interpolation(200)).toBe(1);
  });

  it('should throw for non monotonic input ranges', () => {
    expect(() =>
      createInterpolation({
        inputRange: [0, 2, 1],
        outputRange: [0, 1, 2],
      }),
    ).toThrow();

    expect(() =>
      createInterpolation({
        inputRange: [0, 1, 2],
        outputRange: [0, 3, 1],
      }),
    ).not.toThrow();
  });

  it('should work with empty input range', () => {
    const interpolation = createInterpolation({
      inputRange: [0, 10, 10],
      outputRange: [1, 2, 3],
      extrapolate: 'extend',
    });

    expect(interpolation(0)).toBe(1);
    expect(interpolation(5)).toBe(1.5);
    expect(interpolation(10)).toBe(2);
    expect(interpolation(10.1)).toBe(3);
    expect(interpolation(15)).toBe(3);
  });

  it('should work with empty output range', () => {
    const interpolation = createInterpolation({
      inputRange: [1, 2, 3],
      outputRange: [0, 10, 10],
      extrapolate: 'extend',
    });

    expect(interpolation(0)).toBe(-10);
    expect(interpolation(1.5)).toBe(5);
    expect(interpolation(2)).toBe(10);
    expect(interpolation(2.5)).toBe(10);
    expect(interpolation(3)).toBe(10);
    expect(interpolation(4)).toBe(10);
  });

  it('should work with easing', () => {
    const interpolation = createInterpolation({
      inputRange: [0, 1],
      outputRange: [0, 1],
      easing: Easing.Quadratic.In,
    });

    expect(interpolation(0)).toBe(0);
    expect(interpolation(0.5)).toBe(0.25);
    expect(interpolation(0.9)).toBe(0.81);
    expect(interpolation(1)).toBe(1);
  });

  it('should work with extrapolate', () => {
    let interpolation = createInterpolation({
      inputRange: [0, 1],
      outputRange: [0, 1],
      extrapolate: 'extend',
      easing: Easing.Quadratic.In,
    });

    expect(interpolation(-2)).toBe(4);
    expect(interpolation(2)).toBe(4);

    interpolation = createInterpolation({
      inputRange: [0, 1],
      outputRange: [0, 1],
      extrapolate: 'clamp',
      easing: Easing.quad,
    });

    expect(interpolation(-2)).toBe(0);
    expect(interpolation(2)).toBe(1);

    interpolation = createInterpolation({
      inputRange: [0, 1],
      outputRange: [0, 1],
      extrapolate: 'identity',
      easing: Easing.quad,
    });

    expect(interpolation(-2)).toBe(-2);
    expect(interpolation(2)).toBe(2);
  });

  // it('should work with keyframes with extrapolate', () => {
  //   const interpolation = createInterpolation({
  //     inputRange: [0, 10, 100, 1000],
  //     outputRange: [0, 5, 50, 500],
  //     extrapolate: true,
  //   });

  //   expect(interpolation(-5)).toBe(-2.5);
  //   expect(interpolation(0)).toBe(0);
  //   expect(interpolation(5)).toBe(2.5);
  //   expect(interpolation(10)).toBe(5);
  //   expect(interpolation(50)).toBe(25);
  //   expect(interpolation(100)).toBe(50);
  //   expect(interpolation(500)).toBe(250);
  //   expect(interpolation(1000)).toBe(500);
  //   expect(interpolation(2000)).toBe(1000);
  // });

  it('should work with keyframes without extrapolate', () => {
    const interpolation = createInterpolation({
      inputRange: [0, 1, 2],
      outputRange: [0.2, 1, 0.2],
      extrapolate: 'clamp',
    });

    expect(interpolation(5)).toBeCloseTo(0.2);
  });

  it('should throw for an infinite input range', () => {
    expect(() =>
      createInterpolation({
        inputRange: [-Infinity, Infinity],
        outputRange: [0, 1],
      }),
    ).toThrow();

    expect(() =>
      createInterpolation({
        inputRange: [-Infinity, 0, Infinity],
        outputRange: [1, 2, 3],
      }),
    ).not.toThrow();
  });

  it('should work with negative infinite', () => {
    const interpolation = createInterpolation({
      inputRange: [-Infinity, 0],
      outputRange: [-Infinity, 0],
      easing: Easing.Quadratic.In,
      extrapolate: 'identity',
    });

    expect(interpolation(-Infinity)).toBe(-Infinity);
    expect(interpolation(-100)).toBeCloseTo(-10000);
    expect(interpolation(-10)).toBeCloseTo(-100);
    expect(interpolation(0)).toBeCloseTo(0);
    expect(interpolation(1)).toBeCloseTo(1);
    expect(interpolation(100)).toBeCloseTo(100);
  });

  it('should work with positive infinite', () => {
    const interpolation = createInterpolation({
      inputRange: [5, Infinity],
      outputRange: [5, Infinity],
      easing: Easing.Quadratic.In,
      extrapolate: 'identity',
    });

    expect(interpolation(-100)).toBeCloseTo(-100);
    expect(interpolation(-10)).toBeCloseTo(-10);
    expect(interpolation(0)).toBeCloseTo(0);
    expect(interpolation(5)).toBeCloseTo(5);
    expect(interpolation(6)).toBeCloseTo(5 + 1);
    expect(interpolation(10)).toBeCloseTo(5 + 25);
    expect(interpolation(100)).toBeCloseTo(5 + 95 * 95);
    expect(interpolation(Infinity)).toBe(Infinity);
  });
});
