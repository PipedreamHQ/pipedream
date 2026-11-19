/**
 * Normalizes the `arguments` prop of a device command. Each string entry is
 * parsed as JSON when possible so that numbers, booleans and objects can be
 * passed from the UI; anything that is not valid JSON is sent as a string.
 */
export function parseArguments(args) {
  if (args === undefined || args === null) {
    return [];
  }
  if (!Array.isArray(args)) {
    args = [
      args,
    ];
  }
  return args.map((arg) => {
    if (typeof arg !== "string") {
      return arg;
    }
    try {
      return JSON.parse(arg);
    } catch (e) {
      return arg;
    }
  });
}
