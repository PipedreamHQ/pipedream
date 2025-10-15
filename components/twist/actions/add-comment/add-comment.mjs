// legacy_hash_id: a_a4irNP
import { axios } from "@pipedream/platform";

export default {
  key: "twist-add-comment",
  name: "Add Comment",
  description: "Adds a new comment to a thread.",
  version: "0.2.2",
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
      type: "any",
      description: "List of attachments to the new comment. It must follow the JSON format returned by [attachment#upload](https://api.twistapp.com/v3/#upload-an-attachment).",
      optional: true,
    },
    actions: {
      type: "string",
      description: "List of action to the new comment. More information about the format of the object available at the [add an action button submenu](https://api.twistapp.com/v3/#add-an-action-button).",
      optional: true,
    },
    direct_mentions: {
      type: "any",
      description: "The users that are directly mentioned.",
      optional: true,
    },
    direct_group_mentions: {
      type: "any",
      description: "The groups that are directly mentioned.",
      optional: true,
    },
    recipients: {
      type: "any",
      description: "An array of users (e.g. recipients: `[10000, 10001]`) to notify. It also accepts the strings `EVERYONE` or `EVERYONE_IN_THREAD`, which notifies everyone in the workspace or everyone mentioned in previous posts of this thread. If not provided, `EVERYONE_IN_THREAD` will be used.",
      optional: true,
    },
    groups: {
      type: "any",
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
        attachments: this.attachments,
        actions: this.actions,
        direct_mentions: this.direct_mentions,
        direct_group_mentions: this.direct_group_mentions,
        recipients: this.recipients,
        groups: this.groups,
        temp_id: this.temp_id,
        mark_thread_position: this.mark_thread_position,
        send_as_integration: this.send_as_integration,
      },
    });
  },
};
