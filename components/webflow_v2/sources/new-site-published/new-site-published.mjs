import constants from "../../common/constants.mjs";
import common from "../common/common.mjs";

export default {
  type: "source",
  key: "webflow_v2-new-site-published",
  name: "New Site Published",
  description: "Emit new event when a site is published. [See the docs here](https://developers.webflow.com/#trigger-types)",
  version: "0.0.{{ts}}",
  ...common,
  hooks: {
    ...common.hooks,
    async deploy() {
      console.log("Retrieving historical events...");

      const sites = await this.app.listSites();
      const filtered = sites.filter((site) => site.lastPublished);
      const sliced = filtered.slice(
        filtered.length - constants.DEPLOY_OFFSET,
        constants.DEPLOY_OFFSET,
      );
      const sorted = sliced.sort((a, b) => Date.parse(a.lastPublished) > Date.parse(b.lastPublished)
        ? -1
        : 1);

      this.emitHistoricalEvents(sorted);
    },
  },
  methods: {
    ...common.methods,
    getWebhookTriggerType() {
      return "site_publish";
    },
    generateMeta({ siteId, publishedOn }) {
      return {
        id: `${siteId}-${publishedOn}`,
        summary: `Site published: ${siteId}`,
        ts: Date.parse(publishedOn),
      };
    },
  },
};
