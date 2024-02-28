export default {
  parseObj(obj) {
    return !obj
      ? undefined
      : typeof obj === "string"
        ? JSON.parse(obj)
        : obj;
  },
  cleanObj(o) {
    for (var k in o || {}) {
      if (typeof o[k] === "undefined") {
        delete o[k];
      }
    }
    return o;
  },
  getFilePath(path) {
    return path.includes("tmp/")
      ? path
      : `/tmp/${path}`;
  },
};
