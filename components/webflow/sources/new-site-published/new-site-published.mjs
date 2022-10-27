import common from "../common/common.mjs";
import constants from "../../common/constants.mjs";

export default {
  type: "source",
  key: "webflow-new-site-published",
  name: "New Site Published",
  description: "Emit new event when a site is published. [See the docs here](https://developers.webflow.com/#trigger-types)",
  version: "0.2.1",
  ...common,
  hooks: {
    ...common.hooks,
    async deploy() {
      console.log("Retrieving historical events...");

      const sites = await this._makeRequest("/sites", {
        limit: this.historicalEventsNumber,
      });

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
    generateMeta(data) {
      return {
        id: `${data.site}-${data.publishTime}`,
        summary: `The site ${data.site} has been published.`,
        ts: data.publishTime,
      };
    },
  },
};
