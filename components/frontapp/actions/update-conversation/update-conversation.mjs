import utils from "../../common/utils.mjs";
import frontApp from "../../frontapp.app.mjs";

export default {
  key: "frontapp-update-conversation",
  name: "Update Conversation",
  description: "Updates a conversation. [See the docs here](https://dev.frontapp.com/reference/patch_conversations-conversation-id).",
  version: "0.1.3",
  type: "action",
  props: {
    frontApp,
    conversationId: {
      type: "string",
      description: "Conversation unique identifier",
    },
    assigneeId: {
      type: "string",
      description: "ID of the teammate to assign the conversation to. Set it to null to unassign.",
      optional: true,
    },
    inboxId: {
      type: "string",
      description: "ID of the inbox to move the conversation to.",
      optional: true,
    },
    status: {
      type: "string",
      description: "New status of the conversation",
      optional: true,
      options: [
        "archived",
        "deleted",
        "spam",
        "open",
      ],
    },
    tagIds: {
      type: "string[]",
      description: "List of all the tag IDs replacing the old conversation tags",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      conversationId,
      assigneeId,
      inboxId,
      status,
    } = this;

    const tagIds = utils.parse(this.tagIds);

    const data = {
      assignee_id: assigneeId,
      inbox_id: inboxId,
      status,
      tag_ids: tagIds,
    };

    const effectiveRequestBody = JSON.stringify(data);
    $.export("effective_request_body", effectiveRequestBody);

    const response = await this.frontApp.updateConversation({
      conversationId,
      data,
    });

    $.export("$summary", `Successfully updated conversation with ID ${response.id}`);

    return response;
  },
};
