import specific from "../../specific.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "specific-create-conversation",
  name: "Create Conversation",
  description: "Initializes a fresh chat thread. Requires 'user-id' prop to identify the conversation's owner. Optional 'title' prop can provide a conversation's subject line. [See the documentation](https://public-api.specific.app/docs/introduction/welcome)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    specific,
    userId: {
      propDefinition: [
        specific,
        "userId",
      ],
    },
    title: {
      propDefinition: [
        specific,
        "title",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.specific.initializeChatThread({
      userId: this.userId,
      title: this.title,
    });

    $.export("$summary", `Successfully created conversation for user ID: ${this.userId}`);
    return response;
  },
};
