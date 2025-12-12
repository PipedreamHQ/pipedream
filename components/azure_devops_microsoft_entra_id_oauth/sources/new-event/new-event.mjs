import azureDevops from "../../azure_devops_microsoft_entra_id_oauth.app.mjs";

export default {
  key: "azure_devops_microsoft_entra_id_oauth-new-event",
  name: "New Event (Instant)",
  description: "Emit new event for the specified event type.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    azureDevops,
    db: "$.service.db",
    http: "$.interface.http",
    eventType: {
      propDefinition: [
        azureDevops,
        "eventType",
      ],
    },
  },
  hooks: {
    async activate() {
      const data = {
        url: this.http.endpoint,
        publisherId: "tfs",
        resourceVersion: "1.0",
        consumerId: "webHooks",
        consumerActionId: "httpRequest",
        consumerInputs: {
          url: this.http.endpoint,
        },
        eventType: this.eventType,
      };
      const { id } = await this.azureDevops.createSubscription({
        data,
      });
      this._setHookId(id);
    },
    async deactivate() {
      const id = this._getHookId();
      await this.azureDevops.deleteSubscription(id);
    },
  },
  methods: {
    _getHookId() {
      return this.db.get("hookId");
    },
    _setHookId(hookId) {
      this.db.set("hookId", hookId);
    },
    generateMeta(body) {
      return {
        id: body.id,
        summary: `New ${this.eventType} event with ID ${body.id}`,
        ts: Date.parse(body.createdDate),
      };
    },
  },
  async run(event) {
    const { body } = event;
    const meta = this.generateMeta(body);
    this.$emit(body, meta);
  },
};
