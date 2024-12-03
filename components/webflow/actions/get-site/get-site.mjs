import app from "../../webflow.app.mjs";

export default {
  key: "webflow-get-site",
  name: "Get Site",
  description: "Get a site. [See the docs here](https://developers.webflow.com/#get-specific-site)",
  version: "1.0.0",
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
