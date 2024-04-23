export default {
  parseObjArray(arr) {
    if (!arr) {
      return undefined;
    }
    if (typeof arr === "string") {
      return JSON.parse(arr);
    }
    return arr?.map((item) => typeof item === "string"
      ? JSON.parse(item)
      : item) || [];
  },
};
