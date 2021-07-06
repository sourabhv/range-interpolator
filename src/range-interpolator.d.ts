export type ExtrapolateType = 'extend' | 'identity' | 'clamp';

// eslint-disable-next-line no-unused-vars
export type Interpolator = (input: number) => number;

export interface InterpolationConfigType {
  inputRange: number[];
  outputRange: number[];
  // eslint-disable-next-line no-unused-vars
  easing?: (input: number) => number;
  extrapolate?: ExtrapolateType;
  extrapolateLeft?: ExtrapolateType;
  extrapolateRight?: ExtrapolateType;
}
