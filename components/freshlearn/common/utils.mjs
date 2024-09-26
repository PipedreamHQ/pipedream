export default {
  cleanObject(o) {
    for (var k in o || {}) {
      if (typeof o[k] === "undefined") {
        delete o[k];
      }
    }
    return o;
  },
};
