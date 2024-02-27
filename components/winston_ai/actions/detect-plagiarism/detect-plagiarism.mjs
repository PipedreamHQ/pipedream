import winstonAi from "../../winston_ai.app.mjs";

export default {
  key: "winston_ai-detect-plagiarism",
  name: "Detect Plagiarism",
  description: "Inspects if the submitted text contains plagiarised materials. [See the documentation](https://docs.gowinston.ai/api-reference/plagiarism/post)",
  version: "0.0.1",
  type: "action",
  props: {
    winstonAi,
    text: winstonAi.propDefinitions.text,
    language: {
      ...winstonAi.propDefinitions.language,
      optional: true,
    },
    sentences: {
      ...winstonAi.propDefinitions.sentences,
      optional: true,
    },
    version: {
      ...winstonAi.propDefinitions.version,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.winstonAi.checkPlagiarism({
      text: this.text,
      language: this.language,
      sentences: this.sentences,
      version: this.version,
    });

    $.export("$summary", "Plagiarism check completed");
    return response;
  },
};
