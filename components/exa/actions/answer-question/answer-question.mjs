import app from "../../exa.app.mjs";
import {
  parseOptionalJsonSchema,
} from "../../common/utils.mjs";

export default {
  key: "exa-answer-question",
  name: "Answer Question",
  description: "Generate grounded Exa answers with citations. Use this when you want an answer-shaped response instead of raw search results. [See the documentation](https://docs.exa.ai/reference/answer)",
  version: "0.1.0",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    query: {
      label: "Question",
      description: "The question or query to answer",
      propDefinition: [
        app,
        "query",
      ],
    },
    text: {
      propDefinition: [
        app,
        "text",
      ],
      description: "Whether to include full text content from cited results in the response",
    },
    systemPrompt: {
      propDefinition: [
        app,
        "systemPrompt",
      ],
    },
    outputSchema: {
      propDefinition: [
        app,
        "outputSchema",
      ],
    },
    userLocation: {
      propDefinition: [
        app,
        "userLocation",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.answer({
      $,
      data: {
        query: this.query,
        text: this.text,
        systemPrompt: this.systemPrompt,
        outputSchema: parseOptionalJsonSchema(this.outputSchema, "output schema"),
        userLocation: this.userLocation,
      },
    });

    $.export("$summary", "Successfully answered question.");
    return response;
  },
};
