import { ConfigurationError } from "@pipedream/platform";
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
      description: "The question to answer, e.g. `What is the tallest building in Europe?`",
    },
    depth: {
      type: "string",
      label: "Depth",
      description: "How much to read: `fast` answers from the results page; `standard` also reads the top pages, e.g. `fast`. Defaults to `standard`.",
      optional: true,
      options: [
        "fast",
        "standard",
      ],
    },
    numSources: {
      type: "integer",
      label: "Number of Sources",
      description: "Pages to read, from 1 to 5, e.g. `5`. Defaults to `3`. Only with `standard` depth: leave it empty for `fast`.",
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
    if (this.depth === "fast" && this.numSources) {
      throw new ConfigurationError("Number of Sources applies to `standard` depth only; leave it empty for `fast`.");
    }
    const response = await this.app.answerQuestion({
      $,
      data: {
        q: this.q,
        depth: this.depth,
        num_sources: this.numSources,
        country: this.country,
        language: this.language,
        time: this.time,
      },
    });
    $.export("$summary", response.answer
      ? `Answered with ${response.citations?.length ?? 0} citations`
      : "No answer returned: the search found nothing to answer from");
    return response;
  },
};
