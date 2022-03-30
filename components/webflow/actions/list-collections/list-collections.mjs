import webflow from "../../webflow.app.mjs";

export default {
  key: "webflow-list-collections",
  name: "List Collections",
  description: "List collections",
  version: "0.1.1648564084",
  type: "action",
  props: {
    webflow,
    siteId: {
      propDefinition: [
        webflow,
        "sites",
      ],
    },
  },
  async run() {
    return await this.webflow.getCollections(this.siteId);
  },
};
