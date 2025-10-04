import app from "../../google_gemini.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "google_gemini-generate-embeddings",
  name: "Generate Embeddings",
  description: "Generate embeddings from text input using Google Gemini. [See the documentation](https://ai.google.dev/gemini-api/docs/embeddings)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    model: {
      reloadProps: false,
      propDefinition: [
        app,
        "model",
        () => ({
          filter: ({
            description,
            supportedGenerationMethods,
          }) => ![
            "discontinued",
            "deprecated",
          ].some((keyword) => description?.includes(keyword))
            && supportedGenerationMethods?.includes(constants.MODEL_METHODS.EMBED_CONTENT),
        }),
      ],
    },
    text: {
      propDefinition: [
        app,
        "text",
      ],
      description: "The text to generate embeddings for",
    },
    taskType: {
      type: "string",
      label: "Task Type",
      description: "The type of task for which the embeddings will be used",
      options: Object.values(constants.TASK_TYPE),
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.embedContent({
      model: this.model,
      data: {
        taskType: this.taskType,
        content: {
          parts: [
            {
              text: this.text,
            },
          ],
        },
      },
    });

    $.export("$summary", "Successfully generated embeddings");
    return response;
  },
};
