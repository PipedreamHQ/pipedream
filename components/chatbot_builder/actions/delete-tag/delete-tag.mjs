import chatbotBuilder from "../../chatbot_builder.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "chatbot_builder-delete-tag",
  name: "Delete Tag",
  description: "Deletes a tag from Chatbot Builder. [See the documentation](https://app.chatgptbuilder.io/api/swagger/#/accounts/deletetag)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    chatbotBuilder,
    tagId: {
      propDefinition: [
        chatbotBuilder,
        "tagId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.chatbotBuilder.deleteTag({
      tagId: this.tagId,
    });
    $.export("$summary", `Successfully deleted tag with ID: ${this.tagId}`);
    return response;
  },
};