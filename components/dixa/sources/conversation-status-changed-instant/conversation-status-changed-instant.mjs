import dixa from "../../dixa.app.mjs";
import { axios } from "@pipedream/platform";
import crypto from "crypto";

export default {
  key: "dixa-conversation-status-changed-instant",
  name: "Conversation Status Changed Instant",
  description: "Emit new events when the status of a conversation changes (e.g., open, closed, or follow up). [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    dixa,
    name: {
      type: "string",
      label: "Name",
      description: "Name of the event",
      options: [
        {
          label: "Conversation Pending",
          value: "conversationpending",
        },
        {
          label: "Conversation Message Added",
          value: "conversationmessageadded",
        },
        {
          label: "Conversation Tag Added",
          value: "conversationtagadded",
        },
        {
          label: "Conversation Assigned",
          value: "conversationassigned",
        },
        {
          label: "Conversation Pending Expired",
          value: "conversationpendingexpired",
        },
        {
          label: "Conversation Transferred",
          value: "conversationtransferred",
        },
        {
          label: "Conversation Enqueued",
          value: "conversationenqueued",
        },
        {
          label: "Conversation Created",
          value: "conversationcreated",
        },
        {
          label: "Conversation Unassigned",
          value: "conversationunassigned",
        },
        {
          label: "Conversation Open",
          value: "conversationopen",
        },
        {
          label: "Conversation Abandoned",
          value: "conversationabandoned",
        },
        {
          label: "Conversation Closed",
          value: "conversationclosed",
        },
        {
          label: "Conversation Note Added",
          value: "conversationnoteadded",
        },
        {
          label: "Conversation End User Replaced",
          value: "conversationenduserreplaced",
        },
        {
          label: "Conversation Tag Removed",
          value: "conversationtagremoved",
        },
        {
          label: "Conversation Rated",
          value: "conversationrated",
        },
      ],
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
      label: "Webhook HTTP Endpoint",
      description: "Receive webhooks from Dixa",
    },
    db: "$.service.db",
  },
  hooks: {
    async activate() {
      const webhookUrl = this.http.endpoint;
      const events = [
        this.name,
      ];
      const data = {
        url: webhookUrl,
        events: events,
      };

      try {
        const response = await this.dixa._makeRequest({
          method: "POST",
          path: "/webhooks",
          data,
        });
        const webhookId = response.id;
        await this.db.set("webhookId", webhookId);
      } catch (error) {
        throw new Error(`Failed to create webhook: ${error.message}`);
      }
    },
    async deactivate() {
      const webhookId = await this.db.get("webhookId");
      if (webhookId) {
        try {
          await this.dixa._makeRequest({
            method: "DELETE",
            path: `/webhooks/${webhookId}`,
          });
          await this.db.delete("webhookId");
        } catch (error) {
          throw new Error(`Failed to delete webhook: ${error.message}`);
        }
      }
    },
    async deploy() {
      try {
        const conversations = await this.dixa.listConversations({
          paginate: true,
          limit: 50,
        });
        for (const conv of conversations) {
          if (conv.status) {
            this.$emit(conv, {
              id: conv.id,
              summary: `Conversation ${conv.id} status changed to ${conv.status}`,
              ts: Date.parse(conv.updatedAt) || Date.now(),
            });
          }
        }
      } catch (error) {
        throw new Error(`Failed to deploy historical events: ${error.message}`);
      }
    },
  },
  async run(event) {
    const signature = event.headers["X-Dixa-Signature"] || event.headers["x-dixa-signature"];
    const rawBody = event.raw_body;

    if (!signature || !rawBody) {
      this.http.respond({
        status: 400,
        body: "Bad Request",
      });
      return;
    }

    const secret = this.dixa.$auth.api_token;
    const computedSignature = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("base64");

    if (computedSignature !== signature) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }

    const eventData = JSON.parse(rawBody);
    const conversation = eventData.conversation;

    if (conversation && conversation.status) {
      this.$emit(conversation, {
        id: conversation.id,
        summary: `Conversation ${conversation.id} status changed to ${conversation.status}`,
        ts: Date.parse(conversation.updatedAt) || Date.now(),
      });
    }

    this.http.respond({
      status: 200,
      body: "OK",
    });
  },
};
