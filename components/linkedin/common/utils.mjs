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

function defaultEncodeFn(key, value) {
  return `${key}=${value}`;
}

function encodeFn(key, value) {
  return `${key}=${encodeURIComponent(value)}`;
}

function getParamsSerializer(encodeFn = defaultEncodeFn) {
  return (params) => {
    return Object.entries(params)
      .map(([
        key,
        value,
      ]) => encodeFn(key, value))
      .join("&");
  };
}

function escapeText(text) {
  const chars = [
    "\\",
    "|",
    "{",
    "}",
    "@",
    "[",
    "]",
    "(",
    ")",
    "<",
    ">",
    "#",
    "*",
    "_",
    "~",
  ];
  for (const char of chars) {
    const escapedChar = "\\" + char;
    const regex = new RegExp(`\\${char}`, "g");
    text = text.replace(regex, escapedChar);
  }
  return text;
}

export default {
  iterate,
  getNestedProperty,
  encodeFn,
  getParamsSerializer,
  escapeText,
};
