import clio from "@pipedream/clio";
import constants from "@pipedream/clio/common/constants.mjs";

export default {
  ...clio,
  type: "app",
  app: "clio_canada",
  methods: {
    ...clio.methods,
    getUrl(path) {
      return `https://ca.app.clio.com${constants.VERSION_PATH}${path}`;
    },
  },
};
