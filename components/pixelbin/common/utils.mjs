async function iterate(iterations) {
  const items = [];
  for await (const item of iterations) {
    items.push(item);
  }
  return items;
}

function appendPropsToFormData(form, props) {
  Object.entries(props)
    .forEach(([
      key,
      value,
    ]) => {
      if (value === undefined) {
        return;
      }
      if (Array.isArray(value)) {
        value.forEach((tag, idx) => {
          form.append(`${key}[${idx}]`, String(tag));
        });
      } else if (typeof value === "object" && value !== null) {
        form.append(key, JSON.stringify(value));
      } else {
        form.append(key, String(value));
      }
    });
}

function getNestedProperty(obj, propertyString) {
  const properties = propertyString.split(".");
  return properties.reduce((prev, curr) => prev?.[curr], obj);
}

export default {
  iterate,
  appendPropsToFormData,
  getNestedProperty,
};
