import common from "../common/common.mjs";

export default {
  ...common,
  name: "New Deal Created (Instant)",
  version: "0.0.1",
  key: "zoho_bigin-new-deal-created",
  description: "Emit new event on each created deal.",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getWebhookEventTypes() {
      return [
        "Deals.create",
      ];
    },
    async deploy() {
      const { data: calls } = await this.app.getDeals({
        params: {
          per_page: 10,
        },
      });

      await Promise.all(calls.map(this.emitEvent));
    },
    async emitEvent(data) {
      const { data: deals } = await this.app.getDeal({
        dealId: data?.id ?? data?.ids[0],
      });

      console.log(deals);

      const deal = deals[0];

      await this.$emit(deal, {
        id: deal.id,
        summary: `New deal created with ID ${deal.id}`,
        ts: Date.parse(deal.Created_Time),
      });
    },
  },
};
