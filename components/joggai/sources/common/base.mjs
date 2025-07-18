import joggai from "../../joggai.app.mjs";

export default {
  props: {
    joggai,
    db: "$.service.db",
    http: "$.interface.http",
  },
  hooks: {
    async activate() {
      const response = await this.joggai.createHook({
        data: {
          events: this.getEvents(),
          url: this.http.endpoint,
          status: "enabled",
        },
      });
      this.db.set("webhookId", response.data.endpoint_id);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      await this.joggai.deleteHook(webhookId);
    },
  },
  async run({ body }) {
    if (typeof body === "string") {
      return;
    }

    this.$emit(body, {
      id: body.event_id,
      summary: this.getSummary(body),
      ts: body.timestamp,
    });
  },
};
