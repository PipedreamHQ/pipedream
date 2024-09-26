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

function transformProps(props) {
  if (!props) {
    return;
  }

  return keysToSnakeCase(
    Object.fromEntries(
      Object.entries(props)
        .filter(([
          key,
          value,
        ]) => typeof(value) !== "function" && key !== "app"),
    ),
  );
}

async function iterate(iterations) {
  const items = [];
  for await (const item of iterations) {
    items.push(item);
  }
  return items;
}

export default {
  transformProps,
  iterate,
};
