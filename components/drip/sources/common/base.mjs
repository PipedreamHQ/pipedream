import drip from "../../drip.app.mjs";

export default {
  props: {
    drip,
    db: "$.service.db",
    http: "$.interface.http",
    includeReceivedEmail: {
      type: "boolean",
      label: "Include Received Email",
      description: "A Boolean specifying whether we should send a notification whenever a subscriber receives an email.",
      default: false,
    },
  },
  hooks: {
    async activate() {
      const eventType = this.getEventType();
      const { webhooks } = await this.drip.createHook({
        webhooks: [
          {
            post_url: this.http.endpoint,
            events: [
              eventType,
            ],
            include_received_email: this.includeReceivedEmail,
          },
        ],
      });
      this.setHookId(webhooks[0].id);
    },
    async deactivate() {
      const hookId = this.getHookId();
      await this.drip.deleteHook(hookId);
    },
  },
  methods: {
    getHookId() {
      return this.db.get("hookId");
    },
    setHookId(hookId) {
      this.db.set("hookId", hookId);
    },
    emitEvent(body) {
      const {
        data, occurred_at,
      } = body;

      this.$emit(body, {
        id: data.subscriber.id + occurred_at,
        summary: this.getSummary(data),
        ts: new Date(occurred_at).getTime(),
      });
    },
  },
  async run({ body }) {
    await this.emitEvent(body);
  },
};
