import app from "../../chatbot_builder.app.mjs";

export default {
  key: "chatbot_builder-delete-tag",
  name: "Delete Tag",
  description: "Deletes a tag from Chatbot Builder. [See the documentation](https://app.chatgptbuilder.io/api/swagger/#/accounts/deletetag)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    tagId: {
      propDefinition: [
        app,
        "tagId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.deleteTag({
      $,
      tagId: this.tagId,
    });
    $.export("$summary", `Successfully deleted tag with ID: ${this.tagId}`);
    return response;
  },
};
