import webflow from "../../webflow.app.mjs";

export default {
  key: "webflow-publish-site",
  name: "Publish Site",
  description: "Get a site in a specific domain",
  version: "0.1.1648564084",
  type: "action",
  props: {
    webflow,
    siteId: {
      propDefinition: [
        webflow,
        "sites",
      ],
    },
    domainIds: {
      propDefinition: [
        webflow,
        "domains",
        (c) => ({
          siteId: c.siteId,
        }),
      ],
    },
  },
  async run() {
    const webflow = this.webflow._createApiClient();

    return await webflow.publishSite({
      siteId: this.siteId,
      domains: this.domainIds,
    });
  },
};
