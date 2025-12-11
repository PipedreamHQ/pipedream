import callrail from "../../callrail.app.mjs";

export default {
  props: {
    callrail,
    db: "$.service.db",
    http: "$.interface.http",
  },
  methods: {
    _setWebhookId(id) {
      this.db.set("webhookId", id);
    },
    _getWebhookId() {
      return this.db.get("webhookId");
    },
    _setAccountId(id) {
      this.db.set("accountId", id);
    },
    _getAccountId() {
      return this.db.get("accountId");
    },
  },
  hooks: {
    async activate() {
      let accountId = await this._getAccountId();
      if (!accountId) {
        const {
          accounts: [
            { id },
          ],
        } = await this.callrail.getAccounts();
        accountId = id;
        this._setAccountId(accountId);
      }
      const response = await this.callrail.createHook({
        accountId,
        data: {
          type: "Webhooks",
          config: this.getConfigs(this.http.endpoint),
        },
      });
      this._setWebhookId(response.id);
    },
    async deactivate() {
      const accountId = await this._getAccountId();
      const webhookId = this._getWebhookId();
      await this.callrail.deleteHook({
        accountId,
        webhookId,
      });
    },
  },
  async run({ body }) {
    const ts = body.timestamp || Date.now();
    this.$emit(body, {
      id: `${body.id}-${ts}`,
      summary: this.getSummary(body),
      ts,
    });
  },
};
