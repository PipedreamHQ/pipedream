const common = require("../common.js");

module.exports = {
  ...common,
  name: "Unblock User",
  key: "twitch-unblock-user",
  description: "Unblocks a user; that is, deletes a specified target user to your blocks list",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    user: {
      propDefinition: [
        common.props.twitch,
        "user",
      ],
      description: "User ID of the user to be unblocked",
    },
  },
  async run() {
    const params = {
      target_user_id: this.user,
    };
    const {
      status,
      statusText,
    } = await this.twitch.unblockUser(params);
    return status == 204
      ? "User Successfully Unblocked"
      : `${status} ${statusText}`;
  },
};
