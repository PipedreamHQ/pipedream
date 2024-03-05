import chatbotBuilder from "../../chatbot_builder.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "chatbot_builder-create-tag",
  name: "Create Tag",
  description: "Creates a new tag in Chatbot Builder. [See the documentation](https://app.chatgptbuilder.io/api/swagger/#/accounts/createtag)",
  version: `0.0.${Date.now()}`,
  type: "action",
  props: {
    chatbotBuilder,
    tagData: {
      propDefinition: [
        chatbotBuilder,
        "tagData"
      ]
    },
  },
  async run({ $ }) {
    const response = await this.chatbotBuilder.createTag({ tagData: this.tagData });
    $.export("$summary", `Successfully created a new tag with ID: ${response.id}`);
    return response;
  },
};