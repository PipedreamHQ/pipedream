import bunnydoc from "../../bunnydoc.app.mjs";

export default {
  props: {
    bunnydoc,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
  },
  hooks: {
    async activate() {
      const response = await this.bunnydoc.createHook({
        data: {
          hookUrl: this.http.endpoint,
          webhookEvents: this.getEvents(),
        },
      });
      this.db.set("webhookId", response.id);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      await this.bunnydoc.deleteHook(webhookId);
    },
  },
  async run({ body }) {
    if (body.event_type === "callback_test") {
      return this.http.respond({
        status: 200,
        body: "BUNNYDOC API EVENT RECEIVED",
      });
    }

    this.$emit(body, {
      id: body.event_metadata.envelope_id,
      summary: body.event_metadata.event_message,
      ts: Date.parse(body.event_time),
    });
  },
};
