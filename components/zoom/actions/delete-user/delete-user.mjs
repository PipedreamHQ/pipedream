// legacy_hash_id: a_a4iKYo
import { axios } from "@pipedream/platform";

export default {
  key: "zoom-delete-user",
  name: "Delete User",
  description: "Disassociates (unlinks) a user from the associated account or permanently deletes a user.",
  version: "0.2.5",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    zoom: {
      type: "app",
      app: "zoom",
    },
    user_id: {
      type: "string",
      description: "The user ID or email address of the user.",
    },
    action: {
      type: "string",
      description: "Delete action options:<br>`disassociate` - Disassociate a user.<br>`delete`-  Permanently delete a user.<br>Note: To delete pending user in the account, use `disassociate",
      optional: true,
      options: [
        "disassociate",
        "delete",
      ],
    },
    transfer_email: {
      type: "string",
      description: "Transfer email.",
      optional: true,
    },
    transfer_meeting: {
      type: "boolean",
      description: "Transfer meeting.",
      optional: true,
    },
    transfer_webinar: {
      type: "boolean",
      description: "Transfer webinar.",
      optional: true,
    },
    transfer_recording: {
      type: "boolean",
      description: "Transfer recording.",
      optional: true,
    },
  },
  async run({ $ }) {
  //See the API docs here: https://marketplace.zoom.us/docs/api-reference/zoom-api/users/userdelete
    const config = {
      method: "delete",
      url: `https://api.zoom.us/v2/users/${this.user_id}`,
      params: {
        action: this.action,
        transfer_email: this.transfer_email,
        transfer_meeting: this.transfer_meeting,
        transfer_webinar: this.transfer_webinar,
        transfer_recording: this.transfer_recording,
      },
      headers: {
        "Authorization": `Bearer ${this.zoom.$auth.oauth_access_token}`,
        "Content-Type": "application/json",
      },
    };
    return await axios($, config);
  },
};
