// legacy_hash_id: a_elirJ5
import { axios } from "@pipedream/platform";

export default {
  key: "twist-add-thread",
  name: "Add Thread",
  description: "Adds a new thread to a channel.",
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
    channel_id: {
      type: "string",
      description: "The id of the channel where the thread will be created.",
    },
    content: {
      type: "string",
      description: "The content of the new thread. Mentions can be used as `[Name](twist-mention://user_id)` for users or `[Group name](twist-group-mention://group_id)` for groups. Check [limits](https://api.twistapp.com/v3/#limits) for size restrictions for the content.",
    },
    title: {
      type: "string",
      description: "The title of the new thread.",
    },
    actions: {
      type: "any",
      description: "List of action to the new thread. More information about the format of the object available at the add an [action button submenu](https://api.twistapp.com/v3/#add-an-action-button).",
      optional: true,
    },
    attachments: {
      type: "any",
      description: "List of attachments to the new thread. It must follow the JSON format returned by [attachment#upload.](https://api.twistapp.com/v3/#upload-an-attachment)",
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
      description: "An array of users (e.g. recipients: `[10000, 10001]`) that will be attached to the thread. It also accepts the string `EVERYONE`, which notifies everyone in the workspace. If not included, the value will default to `user_ids` of the target channel. If you specify `[]`, no Twist users will be notified, and the thread creator will become the sole participant.",
      optional: true,
    },
    groups: {
      type: "any",
      description: "The groups that will be notified.",
      optional: true,
    },
    temp_id: {
      type: "string",
      description: "The temporary id of the thread.",
      optional: true,
    },
    send_as_integration: {
      type: "boolean",
      description: "Displays the integration as the thread creator.",
      optional: true,
    },
  },
  async run({ $ }) {
  //See the API docs: https://api.twistapp.com/v3/#add-thread

    if (!this.channel_id || !this.content || !this.title) {
      throw new Error("Must provide thread_id, content, and title parameters.");
    }

    return await axios($, {
      method: "post",
      url: "https://api.twist.com/api/v3/threads/add",
      headers: {
        Authorization: `Bearer ${this.twist.$auth.oauth_access_token}`,
      },
      data: {
        actions: this.actions,
        attachments: this.attachments,
        channel_id: this.channel_id,
        content: this.content,
        direct_mentions: this.direct_mentions,
        direct_group_mentions: this.direct_group_mentions,
        recipients: this.recipients,
        groups: this.groups,
        temp_id: this.temp_id,
        title: this.title,
        send_as_integration: this.send_as_integration,
      },
    });
  },
};
