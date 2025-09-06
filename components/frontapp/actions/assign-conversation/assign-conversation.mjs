import frontApp from "../../frontapp.app.mjs";

export default {
  key: "frontapp-assign-conversation",
  name: "Assign Conversation",
  description: "Assign or unassign a conversation. [See the documentation](https://dev.frontapp.com/reference/update-conversation-assignee)",
  version: "0.0.3",
  type: "action",
  props: {
    frontApp,
    conversationId: {
      propDefinition: [
        frontApp,
        "conversationId",
      ],
    },
    assigneeId: {
      propDefinition: [
        frontApp,
        "teammateId",
      ],
      label: "Assignee ID",
      description: "ID of the contact to assign",
    },
  },
  async run({ $ }) {
    const response = await this.frontApp.updateConversationAssignee({
      $,
      conversationId: this.conversationId,
      data: {
        assignee_id: this.assigneeId,
      },
    });
    $.export("$summary", `Successfully assigned contact to conversation with ID: ${this.conversationId}`);
    return response;
  },
};
