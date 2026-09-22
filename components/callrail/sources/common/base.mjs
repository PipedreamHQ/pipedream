import callrail from "../../callrail.app.mjs";

export default {
  props: {
    callrail,
    db: "$.service.db",
    http: "$.interface.http",
    accountId: {
      propDefinition: [
        callrail,
        "accountId",
      ],
    },
    companyId: {
      propDefinition: [
        callrail,
        "companyId",
        ({ accountId }) => ({
          accountId,
        }),
      ],
    },
  },
  methods: {
    _setWebhookId(id) {
      this.db.set("webhookId", id);
    },
    _getWebhookId() {
      return this.db.get("webhookId");
    },
    async getWebhook() {
      const response = this.callrail.paginate({
        fn: this.callrail.listIntegrations,
        accountId: this.accountId,
        params: {
          company_id: this.companyId,
        },
        dataField: "integrations",
      });

      const integrations = [];
      for await (const item of response) {
        if (item.type === "Webhooks") {
          integrations.push(item);
        }
      }

      return integrations[0];
    },
  },
  hooks: {
    async activate() {
      const webhook = await this.getWebhook();

      let hookFn = webhook
        ? this.callrail.updateHook
        : this.callrail.createHook;

      const hookResponse = await hookFn({
        accountId: this.accountId,
        integrationId: webhook?.id,
        data: {
          type: "Webhooks",
          state: "active",
          config: this.getConfigs(webhook?.config, this.http.endpoint),
          company_id: this.companyId,
        },
      });
      this._setWebhookId(hookResponse.id);
    },
    async deactivate() {
      const webhook = await this.getWebhook();

      await this.callrail.updateHook({
        accountId: this.accountId,
        integrationId: webhook.id,
        data: {
          config: this.removeConfig(webhook.config, this.http.endpoint),
        },
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
