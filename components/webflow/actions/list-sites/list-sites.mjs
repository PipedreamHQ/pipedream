import webflow from "../../webflow.app.mjs";

export default {
  key: "webflow-list-sites",
  name: "List Sites",
  description: "List sites",
  version: "0.1.1648564084",
  type: "action",
  props: {
    webflow,
  },
  async run() {
    return await this.webflow.getSites();
  },
};
