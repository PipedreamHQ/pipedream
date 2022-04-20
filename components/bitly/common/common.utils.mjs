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

const formatDeepLink = (deeplinks) => {
  const updatedDeepLink = [];
  const deepLinkErrors = [];
  if (deeplinks?.length) {
    for (let i = 0; i < deeplinks.length; i++) {
      if (deeplinks[i]) {
        try {
          const obj = JSON.parse(deeplinks[i]);
          Object.keys(obj).forEach((key) => {
            if (
              ![
                "app_id",
                "app_uri_path",
                "install_url",
                "install_type",
              ].includes(key)
            ) {
              this.deepLinkErrors.push(
                `deeplinks[${i}] error: ${key} is not present or allowed in object`
              );
            }
          });
          updatedDeepLink.push(obj);
        } catch (error) {
          throw new Error(`Object is malformed on deeplinks[${i}]`);
        }
      }
    }
  }
  if (deepLinkErrors.length) {
    throw new Error(
      deepLinkErrors.join(",") +
        ". Allowed keys are app_id,app_uri_path,install_url,install_type"
    );
  }
  return updatedDeepLink;
};

export { formatQueryString, formatDeepLink };
