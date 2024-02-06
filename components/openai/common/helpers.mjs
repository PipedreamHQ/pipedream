export function parseToolsArray(arr) {
  if (!arr) return undefined;
  return arr.map((value) => {
    if ([
      "retrieval",
      "code_interpreter",
    ].includes(value)) {
      return {
        type: value,
      };
    }
    try {
      return JSON.parse(value);
    } catch (e) {
      return value;
    }
  });
}
