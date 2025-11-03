import pipedrive from "../../pipedrive.app.mjs";

export default {
  props: {
    pipedrive,
    http: "$.interface.http",
    db: "$.service.db",
  },
  methods: {
    _getHookId() {
      return this.db.get("hookId");
    },
    _setHookId(hookId) {
      this.db.set("hookId", hookId);
    },
    getExtraData() {
      return {};
    },
    parseData(data) {
      return data;
    },
  },
  hooks: {
    async activate() {
      const response = await this.pipedrive.addWebhook({
        version: "2.0",
        subscription_url: this.http.endpoint,
        ...this.getExtraData(),
      });

      this._setHookId(response.data.id);
    },
    async deactivate() {
      const webhookId = this._getHookId();
      await this.pipedrive.deleteWebhook(webhookId);
    },
  },
  async run({ body }) {
    const ts = Date.parse(body.meta.timestamp);

    this.$emit(await this.parseData(body), {
      id: `${body.data?.id || body.meta?.id}-${ts}`,
      summary: this.getSummary(body),
      ts,
    });
  },
};
