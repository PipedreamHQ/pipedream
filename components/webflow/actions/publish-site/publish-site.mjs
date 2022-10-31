import webflow from "../../webflow.app.mjs";

export default {
  key: "webflow-publish-site",
  name: "Publish Site",
  description: "Get a site in a specific domain. [See the docs here](https://developers.webflow.com/#publish-site)",
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
    domains: {
      propDefinition: [
        webflow,
        "domains",
        (c) => ({
          siteId: c.siteId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const webflow = this.webflow._createApiClient();

    const response = await webflow.publishSite({
      siteId: this.siteId,
      domains: this.domains,
    });

    $.export("$summary", "Successfully published site");

    return response;
  },
};
