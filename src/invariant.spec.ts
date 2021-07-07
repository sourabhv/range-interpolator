import { invariant } from './invariant';

describe('Invariant', () => {
  it('should throw for non-string format argument', () => {
    expect(() => invariant(false, null)).toThrow();
    expect(() => invariant(true, null)).toThrow();
    expect(() => invariant(false, undefined)).toThrow();
    expect(() => invariant(true, undefined)).toThrow();
  });

  it('should do nothing for true condition', () => {
    expect(() => invariant(true, 'Not thrown')).not.toThrow();
  });

  it('should throw correct message on false condition', () => {
    expect(() => invariant(false, 'Error message')).toThrow(
      new Error('Error message'),
    );
    expect(() => invariant(false, 'Should be %s value', 'true')).toThrow(
      new Error('Should be true value'),
    );
  });
});
