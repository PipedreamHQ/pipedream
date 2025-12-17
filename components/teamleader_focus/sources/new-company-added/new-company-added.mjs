import common from "../common/common.mjs";

export default {
  ...common,
  key: "teamleader_focus-new-company-added",
  name: "New Company Added (Instant)",
  description: "Emit new event for each company added. [See the documentation](https://developer.focus.teamleader.eu/docs/api/webhooks-register)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async getHistoricalEvents() {
      const { data } = await this.teamleaderFocus.listCompanies({
        data: {
          sort: [
            {
              field: "added_at",
              order: "desc",
            },
          ],
        },
      });
      return data;
    },
    getEventTypes() {
      return [
        "company.added",
      ];
    },
    async getResource(body) {
      const companyId = body.subject.id;
      const { data } = await this.teamleaderFocus.getCompany({
        data: {
          id: companyId,
        },
      });
      return data;
    },
    generateMeta(company) {
      return {
        id: company.id,
        summary: company.name,
        ts: Date.parse(company.added_at),
      };
    },
  },
};
