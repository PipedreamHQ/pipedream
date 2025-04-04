async function iterate(iterations) {
  const items = [];
  for await (const item of iterations) {
    items.push(item);
  }
  return items;
}

function getNestedProperty(obj, propertyString) {
  const properties = propertyString.split(".");
  return properties.reduce((prev, curr) => prev?.[curr], obj);
}

export default {
  iterate,
  getNestedProperty,
};
