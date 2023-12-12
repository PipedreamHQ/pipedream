import productboard from "../../productboard.app.mjs";

export default {
  props: {
    productboard,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
  },
  hooks: {
    async deploy() {
      const events = await this.getHistoricalEvents();
      for (const event of events.slice(-25)) {
        this.$emit(event, this.generateMeta(event));
      }
    },
    async activate() {
      const { data } = await this.productboard.createHook({
        data: {
          name: "Pipedream - New Feature",
          events: [
            {
              eventType: this.getEventType(),
            },
          ],
          notification: {
            url: this.http.endpoint,
            version: 1,
          },
        },
      });
      this._setHookId(data.id);
    },
    async deactivate() {
      const hookId = this._getHookId();
      await this.productboard.deleteHook(hookId);
    },
  },
  methods: {
    _getHookId() {
      return this.db.get("hookId");
    },
    _setHookId(hookId) {
      this.db.set("hookId", hookId);
    },
    getEventType() {
      throw new Error("getEventType is not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
  },
  async run(event) {
    const { query: { validationToken } = {} } = event;
    if (validationToken) {
      this.http.respond({
        status: 200,
        headers: {
          "Content-Type": "text/plain",
        },
        body: validationToken,
      });
      console.log("Validated webhook subscription");
      return;
    }

    const targetUrl = event?.body?.data?.links?.target;
    const { data } = await this.productboard.getTarget(targetUrl);
    this.$emit(data, this.generateMeta(data));
  },
};
