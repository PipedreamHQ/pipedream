import winstonAi from "../../winston_ai.app.mjs";

export default {
  key: "winston_ai-detect-ai-content",
  name: "Detect AI-Generated Content",
  description: "Investigates whether AI-generated content is present within the given text. [See the documentation](https://docs.gowinston.ai/api-reference/predict/post)",
  version: "0.0.1",
  type: "action",
  props: {
    winstonAi,
    text: winstonAi.propDefinitions.text,
    language: winstonAi.propDefinitions.language,
    sentences: winstonAi.propDefinitions.sentences,
    version: winstonAi.propDefinitions.version,
  },
  async run({ $ }) {
    const response = await this.winstonAi.checkAiContent({
      text: this.text,
      language: this.language,
      sentences: this.sentences,
      version: this.version,
    });

    $.export("$summary", `AI content detection completed. Human score: ${response.data.score}`);
    return response.data;
  },
};
