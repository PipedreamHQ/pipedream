import common from "../common/common.mjs";

export default {
  ...common,
  name: "New Request Created (Instant)",
  version: "0.0.2",
  key: "accelo-new-request-created",
  description: "Emit new event on each new request created.",
  type: "source",
  dedupe: "unique",
  hooks: {
    ...common.hooks,
    async deploy() {
      const { response: requests } = await this.accelo.getRequests({
        params: {
          _filters: "order_by_desc(date_created)",
          _limit: 10,
        },
      });

      for (const request of requests.slice(0, 10).reverse()) {
        await this.emitEvent(request);
      }
    },
  },
  methods: {
    ...common.methods,
    getWebhookEventType() {
      return "create_request";
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
