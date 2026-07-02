import app from "../../hedy.app.mjs";

export default {
  key: "hedy-create-topic",
  name: "Create Topic",
  description: "Creates a new Hedy meeting topic for organizing sessions."
    + " Topics can include a custom AI analysis context (`topicContext`) — up to 20,000 characters of instructions that guide Hedy's AI when analyzing meetings in this topic."
    + " Use **Update Topic** to modify an existing topic, or **Delete Topic** to remove one."
    + " [See the documentation](https://app.swaggerhub.com/apis-docs/HedyAI/hedy-api/1.5.2#/Topics/post_topics)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    name: {
      type: "string",
      label: "Name",
      description: "The topic name (maximum 100 characters).",
    },
    description: {
      type: "string",
      label: "Description",
      description: "An optional description of the topic (maximum 500 characters).",
      optional: true,
    },
    color: {
      type: "string",
      label: "Color",
      description: "Optional hex color code for the topic (e.g. `#4CAF50`).",
      optional: true,
    },
    iconName: {
      type: "string",
      label: "Icon Name",
      description: "Optional icon identifier for the topic.",
      optional: true,
    },
    topicContext: {
      type: "string",
      label: "Topic Context",
      description: "Optional custom AI instructions for analyzing sessions in this topic (maximum 20,000 characters). Use this to focus Hedy's analysis on specific themes, extract particular insights, or follow custom frameworks.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.createTopic({
      $,
      data: {
        name: this.name,
        description: this.description,
        color: this.color,
        iconName: this.iconName,
        topicContext: this.topicContext,
      },
    });
    const topic = response?.data || response;
    $.export("$summary", `Created topic: ${topic?.name || this.name}`);
    return response;
  },
};
