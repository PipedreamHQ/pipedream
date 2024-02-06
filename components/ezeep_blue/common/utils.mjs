export const checkTmp = (filename, reverse = false) => {
  if (reverse && filename.startsWith("/tmp")) {
    return filename.slice(5);
  }
  if (!filename.startsWith("/tmp")) {
    return `/tmp/${filename}`;
  }
  return filename;
};

export const clearObj = (obj) => {
  return Object.entries(obj)
    .filter(([
      ,
      v,
    ]) => ((v != null && v != "" && JSON.stringify(v) != "{}") || typeof v === "boolean"))
    .reduce((acc, [
      k,
      v,
    ]) => ({
      ...acc,
      [k]: (!Array.isArray(v) && v === Object(v))
        ? clearObj(v)
        : v,
    }), {});
};
