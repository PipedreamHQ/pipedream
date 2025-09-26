import common from "../common/common.mjs";

export default {
  ...common,
  key: "teamleader_focus-new-deal-won",
  name: "New Deal Won (Instant)",
  description: "Emit new event for each deal won. [See the documentation](https://developer.focus.teamleader.eu/docs/api/webhooks-register)",
  version: "0.0.3",
  type: "source",
  methods: {
    ...common.methods,
    async getHistoricalEvents() {
      const { data } = await this.teamleaderFocus.listDeals({
        data: {
          sort: [
            {
              field: "created_at",
              order: "desc",
            },
          ],
        },
      });
      return data?.filter(({ status }) => status === "won") || [];
    },
    getEventTypes() {
      return [
        "deal.won",
      ];
    },
    async getResource(body) {
      const dealId = body.subject.id;
      const { data } = await this.teamleaderFocus.getDeal({
        data: {
          id: dealId,
        },
      });
      return data;
    },
    generateMeta(deal) {
      return {
        id: deal.id,
        summary: deal.title,
        ts: Date.parse(deal.closed_at),
      };
    },
  },
};
