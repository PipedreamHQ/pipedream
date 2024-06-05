import app from "../../revolt.app.mjs";

export default {
  key: "revolt-send-friend-request",
  name: "Send Friend Request",
  description: "Send a friend request to another user. [See the documentation](https://developers.revolt.chat/developers/api/reference.html#tag/relationships/post/users/friend)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    username: {
      propDefinition: [
        app,
        "username",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.sendFriendRequest({
      $,
      data: {
        username: this.username,
      },
    });

    $.export("$summary", `Successfully sent friend request to '${this.username}'`);

    return response;
  },
};
