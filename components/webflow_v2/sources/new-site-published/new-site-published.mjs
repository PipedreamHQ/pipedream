import common from "../common/common.mjs";

export default {
  type: "source",
  key: "webflow_v2-new-site-published",
  name: "Site Published",
  description: "Emit new event when a site is published. [See the docs here](https://developers.webflow.com/#trigger-types)",
  version: "0.0.1",
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
