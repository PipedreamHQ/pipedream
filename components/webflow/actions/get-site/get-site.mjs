import webflow from "../../webflow.app.mjs";

export default {
  key: "webflow-get-site",
  name: "Get Site",
  description: "Get a site. [See the docs here](https://developers.webflow.com/#get-specific-site)",
  version: "0.0.1",
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
    const response = await this.webflow.getSite(this.siteId);

    $.export("$summary", "Successfully retrieved site");

    return response;
  },
};
