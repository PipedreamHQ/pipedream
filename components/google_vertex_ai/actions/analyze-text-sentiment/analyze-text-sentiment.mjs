import vertexAi from "../../google_vertex_ai.app.mjs";

export default {
  key: "google_vertex_ai-analyze-text-sentiment",
  name: "Analyze Text Sentiment",
  description: "Analyzes a specified text for its underlying sentiment. [See the documentation](https://cloud.google.com/vertex-ai/docs/reference/rest/v1/projects.locations.publishers.models/generateContent)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
    text: {
      type: "string",
      label: "Text",
      description: "The content to analyze for sentiment",
    },
  },
  async run({ $ }) {
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
                text: `${this.text}\nClassify the sentiment of the message:\n`,
              },
            ],
          },
        ],
      },
    });
    $.export("$summary", "Successfully analyzed text sentiment");
    return response;
  },
};
