// legacy_hash_id: a_elirJ5
import { axios } from "@pipedream/platform";
import {
  parseObjectArray, parseRecipients,
} from "../../common/utils.mjs";

export default {
  key: "twist-add-thread",
  name: "Add Thread",
  description: "Adds a new thread to a channel. [See the documentation](https://api.twistapp.com/v3/#add-thread)",
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
      type: "string[]",
      label: "Actions",
      description: "List of action buttons to add. Each item must be a JSON string, e.g. `{\"action\":\"open_url\",\"type\":\"action\",\"button_text\":\"View\",\"url\":\"https://example.com\"}`. See the [action button submenu](https://api.twistapp.com/v3/#add-an-action-button).",
      optional: true,
    },
    attachments: {
      type: "string[]",
      label: "Attachments",
      description: "List of attachments to add. Each item must be a JSON string following the format returned by [attachment#upload](https://api.twistapp.com/v3/#upload-an-attachment).",
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
      description: "The users that will be attached to the thread, as user IDs (e.g. `10000`, `10001`). Also accepts the single value `EVERYONE`, which notifies everyone in the workspace. If not included, defaults to the `user_ids` of the target channel. If you specify an empty list, no Twist users will be notified and the thread creator becomes the sole participant.",
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

    const response = await axios($, {
      method: "post",
      url: "https://api.twist.com/api/v3/threads/add",
      headers: {
        Authorization: `Bearer ${this.twist.$auth.oauth_access_token}`,
      },
      data: {
        actions: parseObjectArray(this.actions, "Actions"),
        attachments: parseObjectArray(this.attachments, "Attachments"),
        channel_id: this.channel_id,
        content: this.content,
        direct_mentions: this.direct_mentions,
        direct_group_mentions: this.direct_group_mentions,
        recipients: parseRecipients(this.recipients),
        groups: this.groups,
        temp_id: this.temp_id,
        title: this.title,
        send_as_integration: this.send_as_integration,
      },
    });

    $.export("$summary", `Successfully added thread ${response.id} to channel ${this.channel_id}`);

    return response;
  },
};
