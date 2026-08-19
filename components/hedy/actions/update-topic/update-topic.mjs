import app from "../../hedy.app.mjs";

export default {
  key: "hedy-update-topic",
  name: "Update Topic",
  description: "Updates properties of an existing Hedy topic. All fields are optional — only the fields you provide will be changed."
    + " To clear the custom AI context, pass an empty string or `null` for `topicContext`."
    + " Use **Get Many Topics** to find the topic ID."
    + " [See the documentation](https://app.swaggerhub.com/apis-docs/HedyAI/hedy-api/1.5.2#/Topics/patch_topics__topicId_)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
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
    name: {
      type: "string",
      label: "Name",
      description: "New topic name (maximum 100 characters).",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "New topic description (maximum 500 characters).",
      optional: true,
    },
    color: {
      type: "string",
      label: "Color",
      description: "New hex color code (e.g. `#FF5722`).",
      optional: true,
    },
    iconName: {
      type: "string",
      label: "Icon Name",
      description: "New icon identifier.",
      optional: true,
    },
    topicContext: {
      type: "string",
      label: "Topic Context",
      description: "New custom AI analysis instructions (maximum 20,000 characters). Pass an empty string to clear the existing context.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.updateTopic({
      $,
      topicId: this.topicId,
      data: {
        name: this.name,
        description: this.description,
        color: this.color,
        iconName: this.iconName,
        topicContext: this.topicContext === ""
          ? null
          : this.topicContext,
      },
    });
    const topic = response?.data || response;
    $.export("$summary", `Updated topic: ${topic?.name || this.topicId}`);
    return response;
  },
};
