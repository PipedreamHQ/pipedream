import app from "../../chatbot_builder.app.mjs";

export default {
  key: "chatbot_builder-list-tags",
  name: "List Tags",
  description: "Lists all tags in Chatbot Builder. [See the documentation](https://app.chatgptbuilder.io/api/swagger/#/accounts/getpagetags)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
  },
  async run({ $ }) {
    const tags = await this.app.getTags({
      $,
    });
    $.export("$summary", `Retrieved ${tags.length} tags from page ${this.pageId}`);
    return tags;
  },
};
