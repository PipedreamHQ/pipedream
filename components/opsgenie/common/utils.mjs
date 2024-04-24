export default {
  parseObj(obj) {
    if (!obj) {
      return;
    }
    return typeof obj === "string"
      ? JSON.parse(obj)
      : obj;
  },
  parseObjArray(objArray) {
    if (!objArray) {
      return;
    }
    if (typeof objArray === "string") {
      return JSON.parse(objArray);
    }
    return objArray?.map((item) => typeof item === "string"
      ? JSON.parse(item)
      : item) || [];
  },
};
