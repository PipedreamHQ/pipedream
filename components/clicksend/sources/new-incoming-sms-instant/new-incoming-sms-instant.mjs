import clicksend from "../../clicksend.app.mjs";

export default {
  key: "clicksend-new-incoming-sms-instant",
  name: "New Incoming SMS Instant",
  description: "Emit new event when a new incoming sms is received",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    clicksend: {
      type: "app",
      app: "clicksend",
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  hooks: {
    async activate() {
      const { path } = this.http.endpoint;
      const { data } = await this.clicksend.createWebhook({
        url: path,
        method: "POST",
        encoding: "JSON",
        events: [
          "sms",
        ],
      });
      this.db.set("webhookId", data.id);
    },
    async deactivate() {
      await this.clicksend.deleteWebhook(this.db.get("webhookId"));
    },
  },
  async run(event) {
    const {
      body, headers,
    } = event;

    if (headers["Content-Type"] !== "application/json") {
      return this.http.respond({
        status: 415,
      });
    }

    try {
      const incomingSMS = JSON.parse(body);
      const lastEventId = this.db.get("lastEventId");

      if (incomingSMS.id !== lastEventId) {
        this.$emit(incomingSMS, {
          id: incomingSMS.id,
          summary: `New Incoming SMS from ${incomingSMS.from}`,
          ts: new Date(incomingSMS.date).getTime(),
        });
        this.db.set("lastEventId", incomingSMS.id);
      }

      this.http.respond({
        status: 200,
      });
    } catch (err) {
      this.http.respond({
        status: 400,
      });
    }
  },
};
