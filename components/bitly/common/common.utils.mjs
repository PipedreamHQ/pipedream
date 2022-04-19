const formatQueryString = (payload) => {
  const str = [];
  Object.keys(payload).forEach((p) => {
    const result = Array.isArray(payload[p])
      ? formatArray(p, payload[p])
      : formatNonArray(p, payload[p]);
    result && str.push(result);
  });
  return str.join("&");
};

const formatArray = (key, value) => {
  const str = [];
  if (value.length) {
    for (let i = 0; i < value.length; i++) {
      value[i] &&
        str.push(
          `${encodeURIComponent(key + `[${i}]`)}=${encodeURIComponent(
            value[i]
          )}`
        );
    }
    return str.join("&");
  }
  return null;
};

const formatNonArray = (key, value) => {
  return value
    ? `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    : null;
};

export { formatQueryString };
