import app from "../../hedy.app.mjs";

export default {
  key: "hedy-get-topic",
  name: "Get Topic",
  description: "Retrieves full details for a single Hedy topic by ID, including the complete custom AI analysis context (`topicContext`), cached overview, and session statistics."
    + " The `topicContext` field (up to 20,000 characters) contains custom instructions that guide Hedy's AI analysis for sessions in this topic."
    + " Use **Get Many Topics** first to list topics and obtain a topic ID."
    + " [See the documentation](https://app.swaggerhub.com/apis-docs/HedyAI/hedy-api/1.5.2#/Topics/get_topics__topicId_)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
    const response = await this.app.getTopic({
      $,
      topicId: this.topicId,
    });
    const topic = response?.data || response;
    $.export("$summary", `Retrieved topic: ${topic?.name || this.topicId}`);
    return response;
  },
};
