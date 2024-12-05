import ironclad from "../../ironclad.app.mjs";
import crypto from "crypto";

export default {
  key: "ironclad-new-approval-event-instant",
  name: "New Approval Event Instant",
  description: "Emit new event when a fresh approval event is generated. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    ironclad,
    selectedEvent: {
      propDefinition: [
        ironclad,
        "selectedEvent",
      ],
    },
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
  },
  methods: {
    async _createWebhook() {
      const callbackUrl = this.http.endpoint;
      const events = this.selectedEvent;

      const data = {
        callback_url: callbackUrl,
        events: events,
      };

      const response = await this.ironclad._makeRequest({
        method: "POST",
        path: "/webhooks",
        data,
      });

      return response.webhookID;
    },
    async _deleteWebhook(webhookId) {
      await this.ironclad._makeRequest({
        method: "DELETE",
        path: `/webhooks/${webhookId}`,
      });
    },
    computeSignature(rawBody) {
      const hmac = crypto.createHmac("sha256", this.ironclad.$auth.secret_key);
      return hmac.update(rawBody).digest("hex");
    },
  },
  hooks: {
    async deploy() {
      const workflows = await this.ironclad.listWorkflows();
      const recentWorkflows = workflows.slice(-50);
      for (const workflow of recentWorkflows) {
        this.$emit(workflow, {
          id: workflow.workflowID || workflow.webhookID || workflow.id,
          summary: `New approval event: ${workflow.event}`,
          ts: Date.parse(workflow.timestamp) || Date.now(),
        });
      }
    },
    async activate() {
      const webhookId = await this._createWebhook();
      await this.db.set("webhookId", webhookId);
    },
    async deactivate() {
      const webhookId = await this.db.get("webhookId");
      if (webhookId) {
        await this._deleteWebhook(webhookId);
        await this.db.delete("webhookId");
      }
    },
  },
  async run(event) {
    const rawBody = event.rawBody;
    const receivedSignature = event.headers["X-Ironclad-Signature"];
    const computedSignature = this.computeSignature(rawBody);

    if (computedSignature !== receivedSignature) {
      await this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }

    const payload = JSON.parse(rawBody);
    const id = payload.payload.workflowID || payload.webhookID || Date.now();
    const summary = `New approval event: ${payload.payload.event}`;
    const ts = Date.parse(payload.timestamp) || Date.now();

    this.$emit(payload, {
      id,
      summary,
      ts,
    });
  },
};
