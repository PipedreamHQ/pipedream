// legacy_hash_id: a_A6i7wv
import { axios } from "@pipedream/platform";

export default {
  key: "frontapp-update-conversation",
  name: "Update Conversation",
  description: "Updates a conversation",
  version: "0.1.2",
  type: "action",
  props: {
    frontapp: {
      type: "app",
      app: "frontapp",
    },
    assignee_id: {
      type: "string",
      description: "ID of the teammate to assign the conversation to. Set it to null to unassign.",
      optional: true,
    },
    inbox_id: {
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
    tag_ids: {
      type: "any",
      description: "List of all the tag IDs replacing the old conversation tags",
      optional: true,
    },
    conversation_id: {
      type: "string",
      description: "Conversation unique identifier",
    },
  },
  async run({ $ }) {
  //FrontApp api specifies body should be sent as a data binary.
  //One way to comply with this is to populate an JS object normally
  //and stringify it before requesting.

    var conversationData = {
      assignee_id: this.assignee_id,
      inbox_id: this.inbox_id,
      status: this.status,
      tag_ids: typeof this.tag_ids == "undefined"
        ? this.tag_ids
        : JSON.parse(this.tag_ids),
    };

    const effectiveRequestBody = JSON.stringify(conversationData);
    $.export("effective_request_body", effectiveRequestBody);

    return await axios($, {
      method: "patch",
      url: `https://api2.frontapp.com/conversations/${this.conversation_id}`,
      headers: {
        "Authorization": `Bearer ${this.frontapp.$auth.oauth_access_token}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      data: effectiveRequestBody,
    });
  },
};
