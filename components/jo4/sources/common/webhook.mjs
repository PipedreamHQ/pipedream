import jo4 from "../../jo4.app.mjs";

export default {
  props: {
    jo4,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
  },
  methods: {
    getEventSlug() {
      throw new Error("getEventSlug is not implemented");
    },
    getSummary() {
      throw new Error("getSummary is not implemented");
    },
    async getSampleEvents() {
      return [];
    },
    _getSubscriptionId() {
      return this.db.get("subscriptionId");
    },
    _setSubscriptionId(subscriptionId) {
      this.db.set("subscriptionId", subscriptionId);
    },
  },
  hooks: {
    async activate() {
      const response = await this.jo4.subscribeWebhook({
        event: this.getEventSlug(),
        data: {
          hookUrl: this.http.endpoint,
        },
      });
      if (!response?.id) {
        throw new Error("subscribeWebhook response is missing subscription id");
      }
      this._setSubscriptionId(response.id);
    },
    async deactivate() {
      const subscriptionId = this._getSubscriptionId();
      if (subscriptionId) {
        await this.jo4.unsubscribeWebhook({
          subscriptionId,
        });
      }
    },
    async deploy() {
      const events = await this.getSampleEvents();
      for (const event of events.slice(0, 25)) {
        const data = event.data || event;
        const id = data.id ?? data.slug ?? Date.now();
        this.$emit(event, {
          id,
          summary: this.getSummary(event),
          ts: data.createdAt || event.timestamp || Date.now(),
        });
      }
    },
  },
  async run(event) {
    this.http.respond({
      status: 200,
    });

    const { body } = event;
    if (!body?.data) {
      return;
    }

    const id = body.data?.id ?? body.data?.slug ?? body.timestamp ?? Date.now();

    this.$emit(body, {
      id,
      summary: this.getSummary(body),
      ts: body.timestamp || Date.now(),
    });
  },
};
