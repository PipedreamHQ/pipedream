// legacy_hash_id: a_a4irNP
import { axios } from "@pipedream/platform";
import {
  parseObjectArray, parseRecipients,
} from "../../common/utils.mjs";

export default {
  key: "twist-add-comment",
  name: "Add Comment",
  description: "Adds a new comment to a thread.",
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
    thread_id: {
      type: "string",
      description: "The id of the thread to the add the comment on.",
    },
    content: {
      type: "string",
      description: "The content of the new comment. Mentions can be used as `[Name](twist-mention://user_id)` for users or `[Group name](twist-group-mention://group_id)` for groups. Check [limits](https://api.twistapp.com/v3/#limits) for size restrictions for the content.",
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
    recipients: {
      type: "string[]",
      label: "Recipients",
      description: "The users to notify, as user IDs (e.g. `10000`, `10001`). Also accepts the single value `EVERYONE` or `EVERYONE_IN_THREAD`, which notifies everyone in the workspace or everyone mentioned in previous posts of this thread. If not provided, `EVERYONE_IN_THREAD` is used.",
      optional: true,
    },
    groups: {
      type: "integer[]",
      label: "Groups",
      description: "The groups that will be notified.",
      optional: true,
    },
    temp_id: {
      type: "string",
      description: "The temporary id of the comment.",
      optional: true,
    },
    mark_thread_position: {
      type: "boolean",
      description: "By default, the position of the thread is marked.",
      optional: true,
    },
    send_as_integration: {
      type: "boolean",
      description: "Displays the integration as the comment creator.",
      optional: true,
    },
  },
  async run({ $ }) {
  //See the API docs: https://api.twistapp.com/v3/#add-comment

    if (!this.thread_id || !this.content) {
      throw new Error("Must provide thread_id, and content parameters.");
    }

    return await axios($, {
      method: "post",
      url: "https://api.twist.com/api/v3/comments/add",
      headers: {
        Authorization: `Bearer ${this.twist.$auth.oauth_access_token}`,
      },
      data: {
        thread_id: this.thread_id,
        content: this.content,
        attachments: parseObjectArray(this.attachments, "Attachments"),
        actions: parseObjectArray(this.actions, "Actions"),
        direct_mentions: this.direct_mentions,
        direct_group_mentions: this.direct_group_mentions,
        recipients: parseRecipients(this.recipients),
        groups: this.groups,
        temp_id: this.temp_id,
        mark_thread_position: this.mark_thread_position,
        send_as_integration: this.send_as_integration,
      },
    });
  },
};
