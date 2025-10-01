import vertexAi from "../../google_vertex_ai.app.mjs";

export default {
  key: "google_vertex_ai-classify-text",
  name: "Classify Text",
  description: "Groups a provided text into predefined categories. [See the documentation](https://cloud.google.com/vertex-ai/docs/reference/rest/v1/projects.locations.publishers.models/generateContent)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    vertexAi,
    projectId: {
      propDefinition: [
        vertexAi,
        "projectId",
      ],
    },
    categories: {
      type: "string[]",
      label: "Categories",
      description: "The categories to group the text into",
    },
    text: {
      type: "string",
      label: "Text",
      description: "The text to classify",
    },
  },
  async run({ $ }) {
    const categories = (this.categories.map((category) => `\n- ${category}`)).join("");
    const response = await this.vertexAi.generateContent({
      $,
      projectId: this.projectId,
      model: "gemini-1.0-pro",
      data: {
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `Define the categories for the text below?\nOptions:${categories}\n\nText: ${this.text}`,
              },
            ],
          },
        ],
      },
    });
    $.export("$summary", "Text classified into categories");
    return response;
  },
};
