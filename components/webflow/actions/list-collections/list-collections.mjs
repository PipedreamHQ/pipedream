import app from "../../webflow.app.mjs";

export default {
  key: "webflow-list-collections",
  name: "List Collections",
  description: "List collections. [See the documentation](https://developers.webflow.com/data/reference/cms/collections/list)",
  version: "2.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
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
