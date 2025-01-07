import contentstack from "../../contentstack.app.mjs";

export default {
  props: {
    contentstack,
    db: "$.service.db",
    http: "$.interface.http",
    name: {
      type: "string",
      label: "Webhook Name",
      description: "Name of the webhook",
    },
    branchIds: {
      propDefinition: [
        contentstack,
        "branchIds",
      ],
    },
  },
  hooks: {
    async activate() {
      const {
        webhook, notice,
      } = await this.contentstack.createWebhook({
        data: {
          webhook: {
            name: this.name,
            destinations: [
              {
                target_url: this.http.endpoint,
                authentication_type: "None",
              },
            ],
            channels: this.getChannels(),
            branches: this.branchIds,
            disabled: false,
            concise_payload: false,
            retry_policy: "automatic",
          },
        },
      });
      console.log(notice);
      this._setHookId(webhook.uid);
    },
    async deactivate() {
      const webhookId = this._getHookId();
      if (webhookId) {
        await this.contentstack.deleteWebhook({
          webhookId,
        });
      }
    },
  },
  methods: {
    _getHookId() {
      return this.db.get("hookId");
    },
    _setHookId(hookId) {
      this.db.set("hookId", hookId);
    },
    getChannels() {
      throw new Error("getChannels is not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
  },
  async run(event) {
    const { body } = event;
    if (!body) {
      return;
    }
    const meta = this.generateMeta(body);
    this.$emit(body, meta);
  },
};
