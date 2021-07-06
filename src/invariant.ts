export function invariant(
  condition: boolean,
  format: string,
  ...args: Array<any>
): void {
  if (format === undefined) {
    throw new Error('invariant requires an error message argument');
  }

  if (!condition) {
    let argIndex = 0;
    const error = new Error(format.replace(/%s/g, () => args[argIndex++]));
    error.name = 'Invariant Violation';
    throw error;
  }
}
