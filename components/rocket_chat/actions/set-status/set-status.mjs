import rocketchat from "../../rocket_chat.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "rocket_chat-set-status",
  name: "Set Status",
  description: "Updates the user's status. [See the documentation](https://developer.rocket.chat/reference/api/rest-api/endpoints/user-management/users-endpoints/set-user-status)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    rocketchat,
    statusText: {
      type: "string",
      label: "Status Text",
      description: "The status text to be set for the user",
    },
    statusType: {
      type: "string",
      label: "Status Type",
      description: "The status type to be set for the user (online, away, busy or offline)",
      options: constants.STATUS_TYPES,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.rocketchat.updateUserStatus({
      $,
      data: {
        message: this.statusText,
        status: this.statusType,
      },
    });
    $.export("$summary", `Successfully updated status to "${this.statusText}"`);
    return response;
  },
};
