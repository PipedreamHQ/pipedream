import pickBy from "lodash.pickby";

export default {
  removeUndefined(obj) {
    return pickBy(obj);
  },
};
