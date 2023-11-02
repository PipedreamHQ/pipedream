function parseElements(elements) {
  return Object.fromEntries(
    Object.entries(elements).map(([
      key,
      value,
    ]) => [
      key,
      JSON.parse(value),
    ]),
  );
}

export default {
  parseElements,
};
