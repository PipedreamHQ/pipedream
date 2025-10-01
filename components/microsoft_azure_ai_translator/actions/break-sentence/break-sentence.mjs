import app from "../../microsoft_azure_ai_translator.app.mjs";

export default {
  key: "microsoft_azure_ai_translator-break-sentence",
  name: "Break Sentence",
  description: "Identifies the positioning of sentence boundaries in a piece of text. [See the documentation](https://learn.microsoft.com/en-us/azure/ai-services/translator/reference/v3-0-break-sentence)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    text: {
      propDefinition: [
        app,
        "text",
      ],
    },
  },

  async run({ $ }) {
    const response = await this.app.breakSentence({
      $,
      data: [
        {
          text: this.text,
        },
      ],
    });
    $.export("$summary", "Successfully identified the number and length of the provided sentences ");
    return response;
  },
};
