function stringifyHeaders(headers) {
  if (!headers) {
    return undefined;
  }
  return typeof headers === "string"
    ? headers
    : JSON.stringify(headers);
}

export default {
  stringifyHeaders,
};
