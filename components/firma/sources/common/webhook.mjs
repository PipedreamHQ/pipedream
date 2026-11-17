import firma from "../../firma.app.mjs";

export default {
  props: {
    firma,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
  },
  methods: {
    getEventTypes() {
      throw new Error("getEventTypes not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta not implemented");
    },
    _getWebhookId() {
      return this.db.get("webhookId");
    },
    _setWebhookId(id) {
      this.db.set("webhookId", id);
    },
  },
  hooks: {
    async activate() {
      const response = await this.firma.createWebhook({
        data: {
          url: this.http.endpoint,
          events: this.getEventTypes(),
        },
      });
      this._setWebhookId(response.id);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();
      if (webhookId) {
        await this.firma.deleteWebhook({
          webhookId,
        });
      }
    },
    async deploy() {
      const eventTypes = this.getEventTypes();
      const isCompleted = eventTypes.includes("signing_request.completed");
      const { results } = await this.firma.listSigningRequests({
        params: {
          page: 1,
          page_size: 25,
          sort_by: "created_on",
          sort_order: "desc",
          ...(isCompleted && {
            status: "finished",
          }),
        },
      });
      if (results?.length) {
        for (const item of results.slice(0, 25)) {
          const meta = this.generateMeta(item);
          this.$emit(item, meta);
        }
      }
    },
  },
  async run({
    body, headers,
  }) {
    this.http.respond({
      status: 200,
    });
    const eventTypes = this.getEventTypes();
    const eventType = body?.type || headers?.["x-firma-event"];
    if (eventType && !eventTypes.includes(eventType)) {
      return;
    }
    const meta = this.generateMeta(body);
    this.$emit(body, meta);
  },
};
