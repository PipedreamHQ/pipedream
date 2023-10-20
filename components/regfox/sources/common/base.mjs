import regfox from "../../regfox.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  props: {
    regfox,
    http: "$.interface.http",
    db: "$.service.db",
  },
  hooks: {
    async deploy() {
      let lastId;
      const data = [];

      while (true) {
        const response = await this.listingFunction()({
          params: {
            startingAfter: lastId,
            limit: constants.MAX_LIMIT,
          },
        });

        data.push(...response.data);
        lastId = data[data.length - 1]?.id;

        if (!response.hasMore) {
          break;
        }
      }

      data
        .slice(constants.DEPLOY_LIMIT)
        .forEach((event) => this.emitEvent({
          event,
          id: event.id,
          name: event.name,
          ts: event.dateCreated,
        }));
    },
    async activate() {
      console.log("Creating webhook...");

      const response = await this.regfox.createWebhook({
        url: this.http.endpoint,
        events: this.eventTypes(),
        forms: this.forms.map((form) => ({
          formId: form,
        })),
      });

      console.log(`Webhook ID: ${response.id} created succesfully`);
      this._setWebhookId(response.id);
      this._setSigningSecret(response.signingSecret);
    },
    async deactivate() {
      const id = this._getWebhookId();
      await this.regfox.deleteWebhook(id);
      console.log(`Webhook ${id} deleted successfully`);
    },
  },
  methods: {
    _getWebhookId() {
      return this.db.get("webhookId");
    },
    _setWebhookId(id) {
      this.db.set("webhookId", id);
    },
    _getSigningSecret() {
      return this.db.get("signingSecret");
    },
    _setSigningSecret(signingSecret) {
      this.db.set("signingSecret", signingSecret);
    },
    eventTypes() {
      throw new Error("eventTypes is not implemented");
    },
  },
  async run(event) {
    this.processEvent(event.body);
  },
};
