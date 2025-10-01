import { parseObj } from "../../common/utils.mjs";
import manychat from "../../manychat.app.mjs";

export default {
  key: "manychat-send-dynamic-message-user",
  name: "Send Dynamic Message to User",
  description: "Delivers a dynamic message to a particular user specified by their user ID. [See the documentation](https://api.manychat.com)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    manychat,
    userId: {
      propDefinition: [
        manychat,
        "userId",
      ],
    },
    message: {
      type: "string",
      label: "Message",
      description: "The message to deliver to the user. [See the documentation](https://manychat.github.io/dynamic_block_docs/) to Data Format.",
    },
    messageTag: {
      type: "string",
      label: "Message Tag",
      description: "The message tag. [See the documentation](https://developers.facebook.com/docs/messenger-platform/reference/send-api/) to supported message tags.",
    },
  },
  async run({ $ }) {
    const response = await this.manychat.sendContent({
      data: {
        subscriber_id: this.userId,
        data: parseObj(this.message),
        message_tag: this.messageTag,
      },
    });

    $.export("$summary", `Successfully sent dynamic message to user with ID ${this.userId}`);
    return response;
  },
};
