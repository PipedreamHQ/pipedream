function isJson(value) {
  if (typeof(value) !== "string") {
    return false;
  }

  let parsedValue;
  try {
    parsedValue = JSON.parse(value);
  } catch (e) {
    return false;
  }

  return typeof(parsedValue) === "object" && parsedValue !== null;
}

function valueToObject(value) {
  if (!isJson(value)) {
    return value;
  }
  return JSON.parse(value);
}

export default {
  valueToObject,
};
