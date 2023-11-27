import manychat from "../../manychat.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "manychat-send-dynamic-message-user",
  name: "Send Dynamic Message to User",
  description: "Delivers a dynamic message to a particular user specified by their user ID. [See the documentation](https://api.manychat.com)",
  version: "0.0.{{ts}}",
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
      propDefinition: [
        manychat,
        "message",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.manychat.sendContent({
      userId: this.userId,
      message: this.message,
    });

    $.export("$summary", `Successfully sent dynamic message to user with ID ${this.userId}`);
    return response;
  },
};
