import openphone from "../../openphone.app.mjs";

export default {
  props: {
    openphone,
    http: "$.interface.http",
    db: "$.service.db",
    resourceIds: {
      propDefinition: [
        openphone,
        "from",
      ],
      type: "string[]",
      label: "Resource IDs",
      description: "The IDs of the incoming or outgoing phone numbers to retrieve events for. Use the List Phone Numbers action to retrieve information about phone numbers.",
      optional: true,
    },
    label: {
      type: "string",
      label: "Label",
      description: "A label to identify the webhook",
      optional: true,
    },
  },
  methods: {
    _getHookId() {
      return this.db.get("hookId");
    },
    _setHookId(hookId) {
      this.db.set("hookId", hookId);
    },
    getEventFilter() {
      return true;
    },
  },
  hooks: {
    async activate() {
      const response = await this.openphone.createWebhook({
        data: {
          url: this.http.endpoint,
          events: this.getEvent(),
          resourceIds: this.resourceIds,
          label: this.label,
        },
      });
      this._setHookId(response.data.id);
    },
    async deactivate() {
      const webhookId = this._getHookId();
      await this.openphone.deleteWebhook(webhookId);
    },
  },
  async run({ body }) {
    if (this.getEventFilter(body)) {
      this.$emit(body, {
        id: body.id,
        summary: this.getSummary(body),
        ts: Date.parse(body.data.object.completedAt),
      });
    }
  },
};
