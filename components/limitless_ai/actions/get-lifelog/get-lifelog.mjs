import app from "../../limitless_ai.app.mjs";

export default {
  key: "limitless_ai-get-lifelog",
  name: "Get Lifelog",
  description: "Returns a specific lifelog entry by ID. [See the documentation](https://www.limitless.ai/developers#get-lifelog)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    includeMarkdown: {
      propDefinition: [
        app,
        "includeMarkdown",
      ],
    },
    includeHeadings: {
      propDefinition: [
        app,
        "includeHeadings",
      ],
    },
    id: {
      propDefinition: [
        app,
        "id",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getLifelog({
      $,
      id: this.id,
      params: {
        includeMarkdown: this.includeMarkdown,
        includeHeadings: this.includeHeadings,
      },
    });
    $.export("$summary", `Successfully sent the request and retrieved ${response.meta.lifelogs.count} Lifelog with the specified ID`);
    return response;
  },
};
