import clio from "@pipedream/clio";
import constants from "@pipedream/clio/common/constants.mjs";

export default {
  ...clio,
  type: "app",
  app: "clio_australia",
  methods: {
    ...clio.methods,
    getUrl(path) {
      return `https://au.app.clio.com${constants.VERSION_PATH}${path}`;
    },
  },
};
