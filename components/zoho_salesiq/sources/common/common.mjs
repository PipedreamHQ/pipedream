import zohoSalesIQ from "../../zoho_salesiq.app.mjs";

export default {
  props: {
    zohoSalesIQ,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    screenName: {
      propDefinition: [
        zohoSalesIQ,
        "screenName",
      ],
    },
    appIds: {
      propDefinition: [
        zohoSalesIQ,
        "appIds",
        (c) => ({
          screenName: c.screenName,
        }),
      ],
    },
  },
  hooks: {
    async activate() {
      const { data } = await this.zohoSalesIQ.createWebhook({
        screenName: this.screenName,
        data: {
          type: "data",
          url: this.http.endpoint,
          events: this.getEvents(),
          version: "1",
          app_ids: this.appIds,
        },
      });
      this._setHookId(data.id);
    },
    async deactivate() {
      const webhookId = this._getHookId();
      await this.zohoSalesIQ.deleteWebhook({
        webhookId,
        screenName: this.screenName,
      });
    },
  },
  methods: {
    _getHookId() {
      return this.db.get("hookId");
    },
    _setHookId(hookId) {
      this.db.set("hookId", hookId);
    },
    getEvents() {
      throw new Error("getEvents is not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
  },
  async run(event) {
    this.http.respond({
      status: 200,
    });

    const { body } = event;
    const meta = this.generateMeta(body);
    this.$emit(body, meta);
  },
};
