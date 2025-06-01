import drift from "../../drift.app.mjs";

export default {
  key: "drift-new-message-instant",
  name: "New Message",
  description: "Emit new event when a new message is received in Drift.  [See the docs](https://devdocs.drift.com/docs/webhook-events-1).",
  version: "0.0.1",
  type: "source",
  props: {
    drift,
    http: "$.interface.http",
    conversationId: {
      type: "integer",
      label: "Conversation ID",
      description: "The ID of the conversation to monitor. Emits events for all new messages if not provided.",
      optional: true,
    },
    emailOrId: {
      type: "string",
      label: "Email or ID",
      description: "Email or ID of the user to monitor. Emits events for all new messages if not provided.",
      optional: true,
    },
  },
  async run(event) {

    const { body } = event;
    const { drift } = this;

    if (body?.type !== "new_message") {
      console.log("Ignored non-new_message event:", body?.type);
      return;
    };

    // If conversationId provided
    if (this.conversationId && !(this.conversationId === Number(body.data.conversationId))) {
      console.log(`Ignored. Wrong conversationId. 
                Expected ${this.conversationId} got ${body.data.conversationId}`);
      return;
    };

    const contactId = body.data.author.id;

    const result = await drift.getContactById({
      contactId,
    });

    const email = result.data?.attributes?.email || "unknown";

    if (this.emailOrId &&
            !(email === this.emailOrId || Number(contactId) === Number(this.emailOrId))) {
      console.log(`Ignored. Wrong emailOrId. Expected ${this.emailOrId}`);
      return;
    };

    body.data.attributes =  result.data.attributes;

    this.$emit(body, {
      summary: `New message from contact "${email} " ID "${contactId || "unknown"}"`,
      id: body.data.endUserId,
      ts: body.timeStamp,
    });
  },
};
