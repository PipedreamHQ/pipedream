function encodeParamKeys(keys = []) {
  return (key, value) => {
    if (!keys.includes(key)) {
      return `${key}=${value}`;
    }
    const [
      firstPart,
      ...otherParts
    ] = value.split(":");

    if (!firstPart?.startsWith("(")) {
      const encoded = encodeURIComponent(value)
        .replace("(", "%28")
        .replace(")", "%29");
      return `${key}=${encoded}`;
    }

    return `${key}=${firstPart}:${encodeURIComponent(otherParts.join(":"))}`;
  };
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

function transformResponse(jsonStr) {
  // Regex to target specifically "id" fields, capturing
  // the number to convert it into a string
  // Because the number can be a long number or big integer
  const response = jsonStr.replace(/("id"\s*:\s*)(\d+)/g, "$1\"$2\"");
  return JSON.parse(response);
}

export default {
  encodeParamKeys,
  encodeFn,
  getParamsSerializer,
  transformResponse,
};
