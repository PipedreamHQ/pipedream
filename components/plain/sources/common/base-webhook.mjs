import plain from "../../plain.app.mjs";
import mutations from "../../common/mutations.mjs";

export default {
  props: {
    plain,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
  },
  hooks: {
    async activate() {
      const { data } = await this.plain.post({
        data: {
          query: mutations.createWebhookTarget,
          variables: {
            input: {
              url: this.http.endpoint,
              isEnabled: true,
              description: "Pipedream Webhook",
              eventSubscriptions: [
                {
                  eventType: this.getEventType(),
                },
              ],
            },
          },
        },
      });
      const hookId = data.createWebhookTarget.webhookTarget.id;
      this._setHookId(hookId);
    },
    async deactivate() {
      const hookId = this._getHookId();
      if (hookId) {
        await this.plain.post({
          data: {
            query: mutations.deleteWebhookTarget,
            variables: {
              input: {
                webhookTargetId: hookId,
              },
            },
          },
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
    generateMeta(event) {
      return {
        id: event.id,
        summary: this.getSummary(event),
        ts: Date.parse(event.timestamp),
      };
    },
    getEventType() {
      throw new Error("getEventType is not implemented");
    },
    getSummary() {
      throw new Error("getEventType is not implemented");
    },
  },
  async run({ body }) {
    this.http.respond({
      status: 200,
    });
    const meta = this.generateMeta(body);
    this.$emit(body, meta);
  },
};
