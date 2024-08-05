import whautomate from "../../whautomate.app.mjs";

export default {
  props: {
    whautomate,
    http: {
      type: "$.interface.http",
      customResponse: false,
    },
    db: "$.service.db",
    name: {
      type: "string",
      label: "Name",
      description: "The name of the webhook.",
    },
  },
  hooks: {
    async activate() {
      const data = await this.whautomate.createWebhook({
        data: {
          webhookHeaders: [
            {
              "key": "Content-Type",
              "value": "application/json",
            },
          ],
          events: this.getEvent(),
          name: this.name,
          serverUrl: this.http.endpoint,
          active: true,
        },
      });
      this.db.set("webhookId", data.id);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      await this.whautomate.deleteWebhook(webhookId);
    },
  },
  async run({ body }) {
    if (body.event) {
      const ts = Date.parse(body.event.timeStamp);
      this.$emit(body, {
        id: body.event.id,
        summary: this.getSummary(body),
        ts: ts,
      });
    }
  },
};
