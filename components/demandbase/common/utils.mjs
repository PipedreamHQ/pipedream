import { URLSearchParams } from "url";

function arrayToCommaSeparatedList(array) {
  return array?.join(",");
}

function getUrlEncodedData(data) {
  const params = new URLSearchParams();
  Object.entries(data)
    .forEach(([
      key,
      value,
    ]) => {
      if (Array.isArray(value) && value.length) {
        params.append(key, arrayToCommaSeparatedList(value));
      } else if (value) {
        params.append(key, value);
      }
    });
  return params.toString();
}

export default {
  arrayToCommaSeparatedList,
  getUrlEncodedData,
};
