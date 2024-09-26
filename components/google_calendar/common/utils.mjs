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
};
