const common = require("../common");

module.exports = {
  ...common,
  key: "webflow-site-published",
  name: "Site Published (Instant)",
  description: "Emit an event when a site is published",
  version: "0.0.1",
  methods: {
    ...common.methods,
    getWebhookTriggerType() {
      return "site_publish";
    },
    generateMeta(data) {
      const {
        site: siteId,
        publishTime: ts,
      } = data;
      const summary = `Site published: ${siteId}`;
      const id = `${siteId}-${ts}`;
      return {
        id,
        summary,
        ts,
      };
    },
  },
};
