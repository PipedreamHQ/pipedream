function getOptionalProp(value, separator = ";") {
  return Array.isArray(value) && value.length > 0
    ? value.join(separator)
    : undefined;
}

export default {
  getOptionalProp,
};
