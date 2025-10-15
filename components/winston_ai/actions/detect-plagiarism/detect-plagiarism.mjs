import winstonAi from "../../winston_ai.app.mjs";

export default {
  key: "winston_ai-detect-plagiarism",
  name: "Detect Plagiarism",
  description: "Inspects if the submitted text contains plagiarised materials. [See the documentation](https://docs.gowinston.ai/api-reference/plagiarism/post)",
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
  },
  async run({ $ }) {
    const response = await this.winstonAi.checkPlagiarism({
      $,
      data: {
        text: this.text,
      },
    });

    $.export("$summary", `Sucessfully performed plagiarism check (${response.results_count} results)`);
    return response;
  },
};
