import common from "../common/base.mjs";

export default {
  ...common,
  key: "solve_crm-new-company-created",
  name: "New Company Created (Instant)",
  description: "Emit new event for each new company created. [See the docs here](https://solve360.com/api/webhook-management/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async getHistoricalEvents(limit) {
      return this.solveCrm.listCompanies({
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
        constrainttype: "company",
        title: "Pipedream New Company",
      };
    },
    generateMeta(body) {
      const ts = new Date(body.occured);
      return {
        id: body.objectid,
        summary: `New company with ID ${body.objectid}`,
        ts: ts.getTime(),
      };
    },
  },
};
