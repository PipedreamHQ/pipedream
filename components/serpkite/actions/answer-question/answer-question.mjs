import app from "../../serpkite.app.mjs";

export default {
  key: "serpkite-answer-question",
  name: "Answer Question",
  description: "Answer a question from live Google results with numbered citations. `fast` answers from the results page; `standard` (default) also reads the top pages. A failed answer is not billed ([see pricing](https://serpkite.com/pricing)). [See the documentation](https://serpkite.com/docs/endpoints/answer)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  ai: "optimized",
  props: {
    app,
    q: {
      type: "string",
      label: "Question",
      description: "The question to answer.",
    },
    depth: {
      type: "string",
      label: "Depth",
      description: "`fast` answers from the results page; `standard` also reads the top pages.",
      optional: true,
      options: [
        "fast",
        "standard",
      ],
    },
    numSources: {
      type: "integer",
      label: "Number of Sources",
      description: "Pages to read with `standard` depth (1-5, default 3).",
      optional: true,
      min: 1,
      max: 5,
    },
    country: {
      propDefinition: [
        app,
        "country",
      ],
    },
    language: {
      propDefinition: [
        app,
        "language",
      ],
    },
    time: {
      propDefinition: [
        app,
        "time",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.post({
      $,
      path: "/answer",
      data: {
        q: this.q,
        depth: this.depth,
        num_sources: this.numSources,
        country: this.country,
        language: this.language,
        time: this.time,
      },
      timeout: 120000,
    });
    $.export("$summary", `Answered with ${response.citations?.length ?? 0} citations`);
    return response;
  },
};
