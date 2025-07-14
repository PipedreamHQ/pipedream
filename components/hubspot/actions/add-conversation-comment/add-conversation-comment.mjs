import hubspot from "../../hubspot.app.mjs";

export default {
  key: "hubspot-add-conversation-comment",
  name: "Add Conversation Comment (Internal Note)",
  description: "Add an internal comment to a HubSpot conversation thread. Internal comments are only visible to team members. [See the documentation](https://developers.hubspot.com/docs/api/conversations/threads)",
  version: "0.0.1",
  type: "action",
  props: {
    hubspot,
    threadId: {
      propDefinition: [
        hubspot,
        "threadId",
      ],
    },
    text: {
      type: "string",
      label: "Comment Text",
      description: "The plain text content of the internal comment",
    },
    richText: {
      type: "string",
      label: "Rich Text",
      description: "The rich text/HTML content of the internal comment",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.hubspot.addConversationComment({
      threadId: this.threadId,
      data: {
        text: this.text,
        richText: this.richText || this.text,
        type: "COMMENT",
      },
      $,
    });

    $.export("$summary", `Successfully added internal comment to conversation thread ${this.threadId}`);
    return response;
  },
};