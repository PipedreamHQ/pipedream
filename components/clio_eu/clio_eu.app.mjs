import clio from "@pipedream/clio";
import constants from "@pipedream/clio/common/constants.mjs";

export default {
  ...clio,
  type: "app",
  app: "clio_eu",
  methods: {
    ...clio.methods,
    getUrl(path) {
      return `https://eu.app.clio.com${constants.VERSION_PATH}${path}`;
    },
  },
};
