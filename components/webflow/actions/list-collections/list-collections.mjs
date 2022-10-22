import webflow from "../../webflow.app.mjs";

export default {
  key: "webflow-list-collections",
  name: "List Collections",
  description: "List collections. [See the docs here](https://developers.webflow.com/#list-collections)",
  version: "0.0.2",
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
  async run({ $ }) {
    const response = await this.webflow.getCollections(this.siteId);

    $.export("$summary", "Successfully retrieved collections");

    return response;
  },
};
