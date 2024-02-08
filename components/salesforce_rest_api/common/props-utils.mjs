function toCapitalCase(str) {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

function filterProps(props) {
  if (!props) {
    return;
  }
  return Object.fromEntries(
    Object.entries(props)
      .filter(([
        key,
        value,
      ]) => typeof (value) !== "function"
        && ![
          "app",
          "salesforce",
        ].includes(key)),
  );
}

function keysToCapitalCase(data = {}) {
  return  Object.entries(filterProps(data))
    .reduce((acc, [
      key,
      value,
    ]) => ({
      ...acc,
      [toCapitalCase(key)]: value,
    }), {});
}

export default {
  keysToCapitalCase,
};
