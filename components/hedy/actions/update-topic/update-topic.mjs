import app from "../../hedy.app.mjs";

export default {
  key: "hedy-update-topic",
  name: "Update Topic",
  description: "Updates properties of an existing Hedy topic. All fields are optional — only the fields you provide will be changed."
    + " To clear the custom AI context, pass an empty string or `null` for `topicContext`."
    + " Use **Get Many Topics** to find the topic ID."
    + " [See the documentation](https://www.hedy.ai/help/hedy-api/)",
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
    const data = {};
    if (this.name !== undefined) data.name = this.name;
    if (this.description !== undefined) data.description = this.description;
    if (this.color !== undefined) data.color = this.color;
    if (this.iconName !== undefined) data.iconName = this.iconName;
    if (this.topicContext !== undefined) data.topicContext = this.topicContext || null;

    const response = await this.app.updateTopic({
      $,
      topicId: this.topicId,
      data,
    });
    const topic = response?.data || response;
    $.export("$summary", `Updated topic: ${topic?.name || this.topicId}`);
    return response;
  },
};
