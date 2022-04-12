import common from "../common.mjs";

export default {
  type: "source",
  key: "webflow-new-site-published",
  name: "New site published",
  description: "Emit new event when a site is published. [See the docs here](https://developers.webflow.com/#trigger-types)",
  version: "0.1.1",
  ...common,
  methods: {
    ...common.methods,
    getWebhookTriggerType() {
      return "site_publish";
    },
    generateMeta(data) {
      return {
        id: `${data.site}-${data.publishTime}`,
        summary: `The site ${data.site} has been published.`,
        ts: data.publishTime,
      };
    },
  },
};
