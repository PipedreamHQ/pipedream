import common from "../common/common.mjs";

export default {
  ...common,
  name: "New Request Created (Instant)",
  version: "0.0.1",
  key: "accelo-new-request-created",
  description: "Emit new event on each new request created.",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getWebhookEventType() {
      return "create_request";
    },
    async deploy() {
      const { response: requests } = await this.accelo.getRequests({
        params: {
          _filters: "order_by_desc(date_created)",
          _limit: 10,
        },
      });

      requests.slice(0, 10).reverse()
        .forEach(this.emitEvent);
    },
    async emitEvent(data) {
      const request = await this.accelo.getRequest({
        requestId: data.id,
      });

      this.$emit(request, {
        id: data.id,
        summary: `New request created with ID ${data.id}`,
        ts: Date.parse(data.date_created),
      });
    },
  },
};
