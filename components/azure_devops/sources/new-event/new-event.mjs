import azureDevops from "../../azure_devops.app.mjs";

export default {
  name: "New Event (Instant)",
  version: "0.0.4",
  key: "azure_devops-new-event",
  description: "Emit new event for the specified event type.",
  type: "source",
  dedupe: "unique",
  props: {
    azureDevops,
    db: "$.service.db",
    http: "$.interface.http",
    organization: {
      propDefinition: [
        azureDevops,
        "organizationName",
      ],
    },
    eventType: {
      propDefinition: [
        azureDevops,
        "eventType",
        (c) => ({
          organization: c.organization,
        }),
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
      const { id } = await this.azureDevops.createSubscription(
        this.organization,
        {
          data,
        },
      );
      this._setHookId(id);
    },
    async deactivate() {
      const id = this._getHookId();
      await this.azureDevops.deleteSubscription(this.organization, id);
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
