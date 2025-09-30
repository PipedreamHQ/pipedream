import winstonAi from "../../winston_ai.app.mjs";

export default {
  key: "winston_ai-detect-ai-content",
  name: "Detect AI-Generated Content",
  description: "Investigates whether AI-generated content is present within the given text. [See the documentation](https://docs.gowinston.ai/api-reference/predict/post)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    winstonAi,
    text: {
      propDefinition: [
        winstonAi,
        "text",
      ],
    },
    language: {
      propDefinition: [
        winstonAi,
        "language",
      ],
    },
    sentences: {
      propDefinition: [
        winstonAi,
        "sentences",
      ],
    },
    version: {
      propDefinition: [
        winstonAi,
        "version",
      ],
    },
  },
  async run({ $ }) {
    const {
      winstonAi, ...data
    } = this;
    const response = await winstonAi.checkAiContent({
      $,
      data,
    });

    $.export("$summary", `Successfully scanned for AI content (score: ${response.score})`);
    return response;
  },
};
