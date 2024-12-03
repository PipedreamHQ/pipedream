import common from "../common/common.mjs";

export default {
  type: "source",
  key: "webflow-new-site-published",
  name: "Site Published",
  description: "Emit new event when a site is published. [See the docs here](https://developers.webflow.com/#trigger-types)",
  version: "1.0.0",
  ...common,
  methods: {
    ...common.methods,
    getWebhookTriggerType() {
      return "site_publish";
    },
    generateMeta({
      siteId, publishedOn,
    }) {
      return {
        id: `${siteId}-${publishedOn}`,
        summary: `Site published: ${siteId}`,
        ts: Date.parse(publishedOn),
      };
    },
  },
};
