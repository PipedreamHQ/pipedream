import { ConfigurationError } from "@pipedream/platform";
import lark from "../../lark.app.mjs";

export default {
  key: "lark-add-user-to-lark-group-chat",
  name: "Add User to Lark Group Chat",
  description: "Add a user to a Lark group chat. [See the documentation](https://open.larksuite.com/document/server-docs/historic-version/im-chat/group-chat/add-users-to-a-group-chat)",
  version: "0.0.1",
  type: "action",
  props: {
    lark,
    chatId: {
      propDefinition: [
        lark,
        "chatId",
      ],
    },
    userId: {
      propDefinition: [
        lark,
        "userId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.lark.addUserToGroupChat({
      $,
      chatId: this.chatId,
      data: {
        id_list: [
          this.userId,
        ],
      },
      params: {
        member_id_type: "user_id",
      },
    });

    if (response.code !== 0) {
      throw new ConfigurationError(`Failed to add user to group chat: ${response.msg}`);
    }

    $.export("$summary", `Successfully added user ${this.userId} to group chat with ID ${this.chatId}`);
    return response;
  },
};
