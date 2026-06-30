import app from "../../hedy.app.mjs";

export default {
  key: "hedy-delete-topic",
  name: "Delete Topic",
  description: "Deletes a Hedy topic. Sessions that were linked to the topic are NOT deleted — they are unlinked and remain in your account."
    + " This action is irreversible. Use **Get Many Topics** to find the topic ID before deleting."
    + " [See the documentation](https://app.swaggerhub.com/apis-docs/HedyAI/hedy-api/1.5.2#/Topics/delete_topics__topicId_)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    topicId: {
      propDefinition: [
        app,
        "topicId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.deleteTopic({
      $,
      topicId: this.topicId,
    });
    $.export("$summary", `Deleted topic ${this.topicId}`);
    return response;
  },
};
