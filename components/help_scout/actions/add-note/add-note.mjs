import helpScout from "../../help_scout.app.mjs";

export default {
  key: "help_scout-add-note",
  name: "Add Note to Conversation",
  description: "Adds a note to an existing conversation in Help Scout. [See the documentation](https://developer.helpscout.com/mailbox-api/endpoints/conversations/threads/note/)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    helpScout,
    conversationId: {
      propDefinition: [
        helpScout,
        "conversationId",
      ],
    },
    text: {
      propDefinition: [
        helpScout,
        "text",
      ],
    },
    userId: {
      propDefinition: [
        helpScout,
        "userId",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.helpScout.addNoteToConversation({
      $,
      conversationId: this.conversationId,
      data: {
        text: this.text,
        user: this.userId,
      },
    });
    $.export("$summary", `Successfully added note to conversation ID: ${this.conversationId}`);
    return response;
  },
};
