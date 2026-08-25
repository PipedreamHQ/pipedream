// legacy_hash_id: a_zNiVnJ
import { axios } from "@pipedream/platform";
import { parseObjectArray } from "../../common/utils.mjs";

export default {
  key: "twist-add-message-to-conversation",
  name: "Add Message To Conversation",
  description: "Adds a message to an existing conversation.",
  version: "1.0.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    twist: {
      type: "app",
      app: "twist",
    },
    conversation_id: {
      type: "string",
      description: "The id of the conversation where the message will be added.",
    },
    content: {
      type: "string",
      description: "The content of the new message. Mentions can be used as `[Name](twist-mention://user_id)` for users or `[Group name](twist-group-mention://group_id)` for groups. Check [limits](https://api.twistapp.com/v3/#limits) for size restrictions for the content.",
    },
    attachments: {
      type: "string[]",
      label: "Attachments",
      description: "List of attachments to add. Each item must be a JSON string following the format returned by [attachment#upload](https://api.twistapp.com/v3/#upload-an-attachment).",
      optional: true,
    },
    actions: {
      type: "string[]",
      label: "Actions",
      description: "List of action buttons to add. Each item must be a JSON string, e.g. `{\"action\":\"open_url\",\"type\":\"action\",\"button_text\":\"View\",\"url\":\"https://example.com\"}`. See the [action button submenu](https://api.twistapp.com/v3/#add-an-action-button).",
      optional: true,
    },
    direct_mentions: {
      type: "integer[]",
      label: "Direct Mentions",
      description: "The users that are directly mentioned.",
      optional: true,
    },
    direct_group_mentions: {
      type: "integer[]",
      label: "Direct Group Mentions",
      description: "The groups that are directly mentioned.",
      optional: true,
    },
  },
  async run({ $ }) {
  //See the API docs: https://api.twistapp.com/v3/#add-message-to-conversation

    if (!this.conversation_id || !this.content) {
      throw new Error("Must provide conversation_id, content parameter.");
    }

    return await axios($, {
      method: "post",
      url: "https://api.twist.com/api/v3/conversation_messages/add",
      headers: {
        Authorization: `Bearer ${this.twist.$auth.oauth_access_token}`,
      },
      data: {
        conversation_id: this.conversation_id,
        content: this.content,
        attachments: parseObjectArray(this.attachments, "Attachments"),
        actions: parseObjectArray(this.actions, "Actions"),
        direct_mentions: this.direct_mentions,
        direct_group_mentions: this.direct_group_mentions,
      },
    });
  },
};
