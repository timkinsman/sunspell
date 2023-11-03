/**
 * @author https://www.30secondsofcode.org/js/s/toggle-array-element/
 */
export const toggleElement = <T>(arr: T[], val: T) =>
  arr.includes(val) ? arr.filter((el) => el !== val) : [...arr, val];
