export default {
  filterEmptyValues(obj) {
    if (!obj) {
      return obj;
    }
    return Object.entries(obj)
      .reduce((reduction,
        [
          key,
          value,
        ]) => {
        if (value === undefined || value === null) {
          return reduction;
        }
        return {
          ...reduction,
          [key]: value,
        };
      }, {});
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
