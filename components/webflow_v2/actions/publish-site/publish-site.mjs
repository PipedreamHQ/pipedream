import app from "../../webflow_v2.app.mjs";

export default {
  key: "webflow_v2-publish-site",
  name: "Publish Site",
  description: "Publish a site. [See the docs here](https://developers.webflow.com/#publish-site)",
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
    domains: {
      propDefinition: [
        app,
        "domains",
        (c) => ({
          siteId: c.siteId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.publishSite(this.siteId, this.domains);

    $.export("$summary", "Successfully published site");

    return response;
  },
};
