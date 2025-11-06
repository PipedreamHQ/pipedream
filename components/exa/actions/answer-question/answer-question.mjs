import app from "../../exa.app.mjs";

export default {
  key: "exa-answer-question",
  name: "Answer Question",
  description: "Generates LLM-powered responses to queries, informed by Exa search results with citations. Handles both factual queries requiring direct answers and open-ended questions needing detailed summaries. [See the documentation](https://docs.exa.ai/reference/answer)",
  version: "0.0.1",
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
      description: "Whether to include full text content from search results in the response",
    },
    stream: {
      type: "boolean",
      label: "Stream",
      description: "Enable streaming response via server-sent events (not recommended for Pipedream workflows)",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      query,
      text,
      stream,
    } = this;

    const response = await app.answer({
      $,
      data: {
        query,
        text,
        stream,
      },
    });

    $.export("$summary", "Successfully answered question.");
    return response;
  },
};
