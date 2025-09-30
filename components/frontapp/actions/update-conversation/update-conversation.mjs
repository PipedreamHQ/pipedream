import utils from "../../common/utils.mjs";
import frontApp from "../../frontapp.app.mjs";

export default {
  key: "frontapp-update-conversation",
  name: "Update Conversation",
  description: "Updates a conversation. [See the documentation](https://dev.frontapp.com/reference/patch_conversations-conversation-id).",
  version: "0.1.9",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
        () => ({
          appendNull: true,
        }),
      ],
      label: "Assignee ID",
      description: "ID of the teammate to assign the conversation to. Set it to null to unassign.",
    },
    inboxId: {
      propDefinition: [
        frontApp,
        "inboxId",
      ],
      description: "ID of the inbox to move the conversation to.",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
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
      propDefinition: [
        frontApp,
        "tagIds",
      ],
      optional: true,
      description: "List of all the tag IDs replacing the old conversation tags",
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

    await this.frontApp.updateConversation({
      conversationId,
      data,
    });

    $.export("$summary", `Successfully updated conversation with ID ${conversationId}`);

    return conversationId;
  },
};
