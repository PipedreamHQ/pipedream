export default {
  cleanObject(o) {
    for (var k in o || {}) {
      if (typeof o[k] === "undefined") {
        delete o[k];
      }
    }
    return o;
  },
  parseObject(obj) {
    if (!obj) return undefined;

    if (Array.isArray(obj)) {
      return obj.map((item) => {
        if (typeof item === "string") {
          try {
            return JSON.parse(item);
          } catch (e) {
            return item;
          }
        }
        return item;
      });
    }
    if (typeof obj === "string") {
      try {
        return JSON.parse(obj);
      } catch (e) {
        return obj;
      }
    }
    return obj;
  },
};
