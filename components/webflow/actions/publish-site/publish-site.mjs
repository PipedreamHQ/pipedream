import app from "../../webflow.app.mjs";

export default {
  key: "webflow-publish-site",
  name: "Publish Site",
  description: "Publish a site. [See the documentation](https://developers.webflow.com/data/reference/sites/publish)",
  version: "2.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
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
