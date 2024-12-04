import app from "../../webflow_v2.app.mjs";

export default {
  key: "webflow_v2-list-collections",
  name: "List Collections",
  description: "List collections. [See the docs here](https://developers.webflow.com/#list-collections)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    siteId: {
      propDefinition: [
        app,
        "sites",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.listCollections(this.siteId);

    $.export("$summary", "Successfully retrieved collections");

    return response;
  },
};
