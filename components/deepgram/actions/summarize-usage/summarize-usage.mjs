import deepgram from "../../deepgram.app.mjs";

export default {
  key: "deepgram-summarize-usage",
  name: "Summarize Usage",
  description: "Retrieves a summary of usage statistics. [See the documentation](https://developers.deepgram.com/api-reference/usage/#summarize-usage)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    deepgram,
    projectId: {
      propDefinition: [
        deepgram,
        "projectId",
      ],
    },
    start: {
      propDefinition: [
        deepgram,
        "start",
      ],
    },
    end: {
      propDefinition: [
        deepgram,
        "end",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.deepgram.summarizeUsage({
      projectId: this.projectId,
      params: {
        start: this.start,
        end: this.end,
      },
      $,
    });

    if (response) {
      $.export("$summary", "Successfully retrieved usage statistics");
    }

    return response;
  },
};
