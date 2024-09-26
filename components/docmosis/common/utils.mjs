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
  return Object.entries(parse(prop))
    .reduce((acc, [
      key,
      value,
    ]) => ({
      ...acc,
      [key]: parse(value),
    }), {});
}

export default {
  parseProp,
};
