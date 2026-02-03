import workiom from "../../workiom.app.mjs";

export default {
  props: {
    workiom,
    db: "$.service.db",
    http: "$.interface.http",
    appId: {
      propDefinition: [
        workiom,
        "appId",
      ],
      description: "The ID of the app. You can find this in your tenant URL",
    },
    listId: {
      propDefinition: [
        workiom,
        "listId",
        ({ appId }) => ({
          appId,
        }),
      ],
      description: "The ID of the list to watch for changes. You can find this in your tenant URL",
    },
    name: {
      type: "string",
      label: "Webhook Name",
      description: "A descriptive name for this webhook subscription",
    },
  },
  methods: {
    _setSubscriptionId(id) {
      this.db.set("subscriptionId", id);
    },
    _getSubscriptionId() {
      return this.db.get("subscriptionId");
    },
    getEventType() {
      throw new Error("getEventType() must be implemented");
    },
  },
  hooks: {
    async activate() {
      const response = await this.workiom.createWebhook({
        data: {
          appId: this.appId,
          listId: this.listId,
          name: this.name,
          isActive: true,
          webHook: this.http.endpoint,
          eventType: this.getEventType(),
        },
      });
      this._setSubscriptionId(response.result.id);
    },
    async deactivate() {
      const subscriptionId = this._getSubscriptionId();
      await this.workiom.deleteWebhook({
        params: {
          subscriptionId,
        },
      });
    },
  },
  async run({ body }) {
    this.$emit(body, this.generateMeta(body));
  },
};
