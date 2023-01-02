import common from "../common/base.mjs";

export default {
  ...common,
  key: "solve_crm-new-contact",
  name: "New Contact (Instant)",
  description: "Emit new event for each new contact created. [See the docs here](https://solve360.com/api/webhook-management/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async getHistoricalEvents(limit) {
      return this.solveCrm.listContacts({
        params: {
          limit,
          sortdir: "DESC",
          sortfield: "created",
        },
      });
    },
    getEventParams() {
      return {
        event: "items.create",
        constrainttype: "contact",
        title: "Pipedream New Contact",
      };
    },
    generateMeta(body) {
      const ts = new Date(body.occured);
      return {
        id: body.objectid,
        summary: `New contact with ID ${body.objectid}`,
        ts: ts.getTime(),
      };
    },
  },
};
