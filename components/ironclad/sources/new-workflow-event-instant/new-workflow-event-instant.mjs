import ironclad from "../../ironclad.app.mjs";
import crypto from "crypto";

export default {
  key: "ironclad-new-workflow-event-instant",
  name: "Ironclad New Workflow Event (Instant)",
  description: "Emit new event when a new workflow event is created. [See the documentation](https://developer.ironcladapp.com/reference/webhooks)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    ironclad: {
      type: "app",
      app: "ironclad",
    },
    selectedEvent: {
      propDefinition: [
        ironclad,
        "selectedEvent",
      ],
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  methods: {
    async createWebhook() {
      const body = {
        events: this.selectedEvent.length > 0
          ? this.selectedEvent
          : [
            "*",
          ],
        url: this.http.endpoint,
      };
      const response = await this.ironclad._makeRequest({
        method: "POST",
        path: "/webhooks",
        data: body,
      });
      return response.webhookID;
    },
    async deleteWebhook() {
      const webhookID = await this.db.get("webhookID");
      if (webhookID) {
        await this.ironclad._makeRequest({
          method: "DELETE",
          path: `/webhooks/${webhookID}`,
        });
      }
    },
    async getEvents() {
      const events = await this.ironclad._makeRequest({
        method: "GET",
        path: "/events?limit=50",
      });
      return events;
    },
    verifySignature(rawBody, signature) {
      const secret = this.ironclad.$auth.webhook_secret;
      const computedSignature = crypto.createHmac("sha256", secret).update(rawBody)
        .digest("base64");
      return computedSignature === signature;
    },
  },
  hooks: {
    async deploy() {
      const events = await this.getEvents();
      events.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      for (const event of events) {
        this.$emit(event.payload, {
          id: event.workflowID || event.webhookID,
          summary: `New event: ${event.payload.event}`,
          ts: new Date(event.timestamp).getTime(),
        });
      }
    },
    async activate() {
      const webhookID = await this.createWebhook();
      await this.db.set("webhookID", webhookID);
    },
    async deactivate() {
      await this.deleteWebhook();
      await this.db.delete("webhookID");
    },
  },
  async run(event) {
    const signature = event.headers["X-Ironclad-Signature"];
    const rawBody = event.rawBody;
    if (!this.verifySignature(rawBody, signature)) {
      return this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
    }

    const payload = event.payload;
    if (this.selectedEvent.includes(payload.event) || this.selectedEvent.includes("*")) {
      this.$emit(payload, {
        id: payload.workflowID || payload.webhookID,
        summary: `New event: ${payload.event}`,
        ts: new Date(payload.timestamp).getTime() || Date.now(),
      });
    }
    this.http.respond({
      status: 200,
      body: "OK",
    });
  },
};
