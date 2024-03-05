import chatbotBuilder from "../../chatbot_builder.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "chatbot_builder-list-tags",
  name: "List Tags from a Page",
  description: "Get all tags from a specified page in Chatbot Builder. [See the documentation](https://app.chatgptbuilder.io/api/swagger/#/accounts/getpagetags)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    chatbotBuilder,
    pageId: {
      propDefinition: [
        chatbotBuilder,
        "pageId"
      ]
    },
  },
  async run({ $ }) {
    const tags = await this.chatbotBuilder.getTagsFromPage({ pageId: this.pageId });
    $.export("$summary", `Retrieved ${tags.length} tags from page ${this.pageId}`);
    return tags;
  },
};