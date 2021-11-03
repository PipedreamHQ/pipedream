import common from "../common.mjs";
import constants from "../constants.mjs";

export default {
  ...common,
  methods: {
    ...common.methods,
    setLastUrl(lastUrl) {
      this.db.set(constants.LAST_URL, lastUrl);
    },
    getLastUrl() {
      return this.db.get(constants.LAST_URL);
    },
  },
};
