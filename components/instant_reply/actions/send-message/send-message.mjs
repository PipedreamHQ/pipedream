import { createHash, randomUUID } from "node:crypto";
import instantReply from "../../instant_reply.app.mjs";

export default {
  key: "instant_reply-send-message",
  name: "Send Message",
  description: "Send a free-form reply in an existing WhatsApp, Instagram, or Messenger conversation. The channel's messaging window and consent rules apply. [See the documentation](https://www.instantreply.co/api-reference)",
  version: "0.0.1",
  type: "action",
  annotations: { destructiveHint: true, openWorldHint: true, readOnlyHint: false },
  props: {
    instantReply,
    conversationId: { propDefinition: [instantReply, "conversationId"] },
    content: {
      type: "string",
      label: "Message Text",
      description: "The text to send to the customer.",
    },
    idempotencyKey: {
      type: "string",
      label: "Idempotency Key",
      description: "Optional stable identifier for retries of this exact message. Leave blank to derive one from the Pipedream execution when available.",
      optional: true,
    },
  },
  async run({ $ }) {
    const content = this.content?.trim();
    if (!content) throw new Error("Message text is required.");
    const seed = this.idempotencyKey || $.context?.id || randomUUID();
    const idempotencyKey = `ir-pd-${createHash("sha256")
      .update(`${seed}:${this.conversationId}:${content}`)
      .digest("hex")}`;
    const response = await this.instantReply.sendMessage({
      $,
      conversationId: this.conversationId,
      content,
      idempotencyKey,
    });
    $.export("$summary", `Message sent in conversation ${this.conversationId}`);
    return response;
  },
};
