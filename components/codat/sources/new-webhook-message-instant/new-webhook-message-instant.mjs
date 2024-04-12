import codat from "../../codat.app.mjs";

export default {
  key: "codat-new-webhook-message-instant",
  name: "New Webhook Message (Instant)",
  description: "Emit new event when a specified event type is produced by Codat. [See the documentation](https://docs.codat.io/platform-api#/operations/create-webhook-consumer)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    codat,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    eventTypes: {
      propDefinition: [
        codat,
        "eventTypes",
      ],
    },
    companyId: {
      propDefinition: [
        codat,
        "companyId",
      ],
    },
  },
  hooks: {
    async activate() {
      const data = {
        url: this.http.endpoint,
        eventTypes: this.eventTypes,
      };
      if (this.companyId) {
        data.companyId = this.companyId;
      }
      const { id } = await this.codat.createWebhook({
        data,
      });
      this._setHookId(id);
    },
    async deactivate() {
      const hookId = this._getHookId();
      if (hookId) {
        await this.codat.deleteWebhook({
          hookId,
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
    generateMeta() {

    },
  },
  async run(event) {
    this.http.respond({
      status: 200,
    });
    console.log(event);
  },
};
