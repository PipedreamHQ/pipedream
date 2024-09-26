import common from "../common/common.mjs";

export default {
  ...common,
  key: "overloop-new-campaign-created",
  name: "New Campaign Created",
  description: "Emit new event each time a campaign is created. [See the docs](https://apidoc.overloop.com/#list-automations)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async emitHistoricalEvents({ limit }) {
      const results = await this.processEvent(this.overloop.listAutomations, {
        sort: "-created_at",
        filter: "automation_type:campaign",
      });
      results.slice(0, limit).forEach((result) => this.emitEvent(result));
    },
    getResultTs(campaign) {
      return Date.parse(campaign.attributes.created_at);
    },
    generateMeta(campaign) {
      return {
        id: campaign.id,
        summary: campaign.attributes.name,
        ts: this.getResultTs(campaign),
      };
    },
  },
  async run() {
    const results = await this.processEvent(this.overloop.listAutomations, {
      sort: "-created_at",
      filter: "automation_type:campaign",
    });
    results.forEach((result) => this.emitEvent(result));
  },
};
