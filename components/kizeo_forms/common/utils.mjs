function toSnakeCase(str) {
  return str?.replace(/([A-Z])/g, "_$1").toLowerCase();
}

function keysToSnakeCase(data = {}) {
  return Object.entries(data)
    .reduce((acc, [
      key,
      value,
    ]) => {
      if (key === "app" || typeof value === "function") {
        return acc;
      }
      return {
        ...acc,
        [toSnakeCase(key)]: value,
      };
    }, {});
}

export default {
  keysToSnakeCase,
};
