import app from "../../webflow_v2.app.mjs";

export default {
  key: "webflow_v2-get-site",
  name: "Get Site",
  description: "Get a site. [See the docs here](https://developers.webflow.com/#get-specific-site)",
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
    const response = await this.app.getSite(this.siteId);

    $.export("$summary", "Successfully retrieved site");

    return response;
  },
};
