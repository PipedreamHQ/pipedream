function toSnakeCase(str) {
  return str?.replace(/([A-Z])/g, "_$1").toLowerCase();
}

function keysToSnakeCase(data = {}) {
  return Object.entries(data)
    .reduce((acc, [
      key,
      value,
    ]) => ({
      ...acc,
      [toSnakeCase(key)]: value,
    }), {});
}

export default {
  keysToSnakeCase,
};
