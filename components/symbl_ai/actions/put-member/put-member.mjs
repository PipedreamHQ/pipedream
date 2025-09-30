import symblAIApp from "../../symbl_ai.app.mjs";

export default {
  key: "symbl_ai-put-member",
  name: "Update Member",
  description: "Update an existing Conversation Member object. See the doc [here](https://docs.symbl.ai/docs/conversation-api/update-members/).",
  version: "0.0.4",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    symblAIApp,
    conversationId: {
      propDefinition: [
        symblAIApp,
        "conversationId",
      ],
    },
    memberId: {
      propDefinition: [
        symblAIApp,
        "memberId",
        (c) => ({
          conversationId: c.conversationId,
        }),
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the member in the Conversation.",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the member in the Conversation.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response =
      await this.symblAIApp.putMember({
        conversationId: this.conversationId,
        memberId: this.memberId,
        data: {
          id: this.memberId,
          name: this.name,
          email: this.email,
        },
      });
    $.export("$summary", `${response.message}`);
    return response;
  },
};
