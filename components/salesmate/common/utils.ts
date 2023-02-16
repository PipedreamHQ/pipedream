/* eslint-disable no-unused-vars */
export const clearObj = (obj) => {
  return Object.entries(obj)
    .filter(([
      _,
      v,
    ]) => (v != null && v != ""))
    .reduce(
      (acc, [
        k,
        v,
      ]) => ({
        ...acc,
        [k]: (!Array.isArray(v) && v === Object(v))
          ? clearObj(v)
          : v,
      }),
      {},
    );
};

export const getUrl = ({
  domain, path = "", action = "", version = "v4",
}) => {
  const versions = {
    "v1": `https://${domain}.salesmate.io/apis/v1/${path}`,
    "v1deal": `https://${domain}.salesmate.io/apis/deal/v1/${path}`,
    "v3": `https://${domain}.salesmate.io/apis/v3/${path}`,
    "v4": `https://${domain}.salesmate.io/apis/${path}/v4${action}`,
  };
  return versions[version];
};
