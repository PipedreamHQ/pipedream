import app from "../../webflow.app.mjs";

export default {
  key: "webflow-get-site",
  name: "Get Site",
  description: "Get a site. [See the documentation](https://developers.webflow.com/data/reference/sites/get)",
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
    const response = await this.app.getSite(this.siteId);

    $.export("$summary", "Successfully retrieved site");

    return response;
  },
};
