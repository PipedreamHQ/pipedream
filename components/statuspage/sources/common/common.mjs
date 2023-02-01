import statuspage from "../../statuspage.app.mjs";

export default {
  props: {
    statuspage,
    db: "$.service.db",
    http: "$.interface.http",
    pageId: {
      propDefinition: [
        statuspage,
        "pageId",
      ],
    },
    componentIds: {
      label: "Component IDs",
      description: "The IDs of the component",
      type: "string[]",
      propDefinition: [
        statuspage,
        "componentId",
        (c) => ({
          pageId: c.pageId,
        }),
      ],
    },
    email: {
      label: "Email",
      description: "We'll send an email to this address if the endpoint fails",
      type: "string",
    },
  },
  methods: {
    _getWebhookId() {
      return this.db.get("webhookId");
    },
    _setWebhookId(webhookId) {
      this.db.set("webhookId", webhookId);
    },
    emitEvent(event) {
      throw new Error("emitEvent is not implemented", event);
    },
    deploy(event) {
      throw new Error("deploy is not implemented", event);
    },
  },
  hooks: {
    async deploy() {
      await this.deploy();
    },
    async activate() {
      const subscriber = {
        endpoint: this.http.endpoint,
        email: this.email,
      };

      this.componentIds = typeof this.componentIds === "string"
        ? JSON.parse(this.componentIds)
        : this.componentIds;

      if (this.componentIds.length) {
        subscriber.component_ids = this.componentIds;
      }

      const response = await this.statuspage.createWebhook({
        pageId: this.pageId,
        data: {
          subscriber,
        },
      });

      this._setWebhookId(response.id);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();
      await this.statuspage.removeWebhook({
        pageId: this.pageId,
        webhookId,
      });
    },
  },
  async run(event) {
    this.emitEvent(event.body);
  },
};
