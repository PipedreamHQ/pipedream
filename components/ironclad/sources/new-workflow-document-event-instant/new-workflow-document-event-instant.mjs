import ironclad from "../../ironclad.app.mjs";
import crypto from "crypto";
import { axios } from "@pipedream/platform";

export default {
  key: "ironclad-new-workflow-document-event-instant",
  name: "New Workflow Document Event Instant",
  description: "Emit new event when a workflow document event is freshly established. [See the documentation](${docsLink})",
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
        "ironclad",
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
    async _getWebhookId() {
      return this.db.get("webhookId");
    },
    async _setWebhookId(id) {
      await this.db.set("webhookId", id);
    },
    async _createWebhook() {
      const events = this.selectedEvent;
      const callbackUrl = this.http.endpoint;
      const data = {
        callbackUrl,
        events,
      };
      const response = await this.ironclad._makeRequest({
        method: "POST",
        path: "/webhooks",
        data,
      });
      return response.webhookID || response.id;
    },
    async _deleteWebhook(webhookId) {
      await this.ironclad._makeRequest({
        method: "DELETE",
        path: `/webhooks/${webhookId}`,
      });
    },
    _validateSignature(event) {
      const secret = this.ironclad.$auth.webhook_secret;
      if (!secret) {
        return true; // No secret available, skip validation
      }
      const signature = event.headers["x-ironclad-signature"];
      if (!signature) {
        return false;
      }
      const hmac = crypto.createHmac("sha256", secret);
      hmac.update(JSON.stringify(event.body));
      const computedSignature = hmac.digest("base64");
      return computedSignature === signature;
    },
  },
  hooks: {
    async deploy() {
      const events = this.selectedEvent;
      const fetchEvents = async (event) => {
        const historicalEvents = await this.ironclad._makeRequest({
          method: "GET",
          path: `/events/${event}`,
          params: {
            limit: 50,
            sort: "desc",
          },
        });
        for (const evt of historicalEvents.payload) {
          this.$emit(evt, {
            id: evt.webhookID || evt.workflowID || evt.documentKey || crypto.randomBytes(16).toString("hex"),
            summary: `Historical event: ${evt.event}`,
            ts: Date.parse(evt.timestamp) || Date.now(),
          });
        }
      };

      if (events.includes("*")) {
        const allEvents = [
          "workflow_launched",
          "workflow_updated",
          "workflow_completed",
          "workflow_cancelled",
          "workflow_approval_status_changed",
          "workflow_attribute_updated",
          "workflow_comment_added",
          "workflow_comment_removed",
          "workflow_comment_updated",
          "workflow_comment_reaction_added",
          "workflow_comment_reaction_removed",
          "workflow_counterparty_invite_sent",
          "workflow_counterparty_invite_revoked",
          "workflow_documents_added",
          "workflow_documents_removed",
          "workflow_documents_updated",
          "workflow_documents_renamed",
          "workflow_document_edited",
          "workflow_changed_turn",
          "workflow_paused",
          "workflow_resumed",
          "workflow_roles_assigned",
          "workflow_signature_packet_sent",
          "workflow_signature_packet_signer_first_viewed",
          "workflow_signature_packet_signer_viewed",
          "workflow_signature_packet_uploaded",
          "workflow_signature_packet_signatures_collected",
          "workflow_signature_packet_fully_signed",
          "workflow_signature_packet_cancelled",
          "workflow_signer_added",
          "workflow_signer_removed",
          "workflow_signer_reassigned",
          "workflow_step_updated",
        ];
        for (const event of allEvents) {
          await fetchEvents(event);
        }
      } else {
        for (const event of events) {
          await fetchEvents(event);
        }
      }
    },
    async activate() {
      const webhookId = await this._createWebhook();
      await this._setWebhookId(webhookId);
    },
    async deactivate() {
      const webhookId = await this._getWebhookId();
      if (webhookId) {
        await this._deleteWebhook(webhookId);
      }
    },
  },
  async run(event) {
    // Validate webhook signature
    const isValid = this._validateSignature(event);
    if (!isValid) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }

    const payload = event.body;

    // Determine a unique ID for deduplication
    const uniqueId = payload.webhookID || payload.workflowID || payload.documentKey || crypto.randomBytes(16).toString("hex");

    // Emit the event
    this.$emit(payload, {
      id: uniqueId,
      summary: `New document event: ${payload.event}`,
      ts: Date.parse(payload.timestamp) || Date.now(),
    });

    // Respond to the HTTP request
    this.http.respond({
      status: 200,
      body: "OK",
    });
  },
};
