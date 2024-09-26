async function iterate(iterations) {
  const items = [];
  for await (const item of iterations) {
    items.push(item);
  }
  return items;
}

function isJson(value) {
  if (typeof(value) !== "string") {
    return false;
  }

  try {
    JSON.parse(value);
  } catch (e) {
    return false;
  }
  return true;
}

function parse(value) {
  return isJson(value)
    ? JSON.parse(value)
    : value;
}

function parseProp(prop) {
  if (!prop) {
    return;
  }
  return Object.entries(prop)
    .reduce((acc, [
      key,
      value,
    ]) => ({
      ...acc,
      [key]: parse(value),
    }), {});
}

export default {
  iterate,
  parse,
  parseProp,
};
