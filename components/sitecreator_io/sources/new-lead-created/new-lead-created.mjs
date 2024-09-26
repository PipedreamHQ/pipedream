import common from "../common/base.mjs";

export default {
  ...common,
  key: "sitecreator_io-new-lead-created",
  name: "New Lead Created",
  description: "Emit new event when a new lead is added to a website. [See the docs here](http://api-doc.sitecreator.io/#tag/Contact/operation/getLeads)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async getResources() {
      return this.sitecreator.getLeads({
        data: {
          siteId: this.siteId,
        },
      });
    },
    generateMeta(lead) {
      return {
        id: lead.id,
        summary: `New Lead ID ${lead.id}`,
        ts: Date.now(),
      };
    },
  },
};
