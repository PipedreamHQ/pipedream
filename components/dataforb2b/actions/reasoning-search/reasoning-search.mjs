import { ConfigurationError } from "@pipedream/platform";
import dataforb2b from "../../dataforb2b.app.mjs";

export default {
  key: "dataforb2b-reasoning-search",
  name: "Reasoning Search",
  description: "Run a live reasoning-based search. Use this when you want the reasoning engine to iteratively interpret a natural-language query and return relevant people or company results. This is distinct from **Agentic Search**, which performs a one-shot LLM search. Provide a natural-language `query` and a `category` (`people` or `company`). [See the documentation](https://docs.dataforb2b.ai/api-reference/reasoning-search)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    dataforb2b,
    query: {
      propDefinition: [
        dataforb2b,
        "query",
      ],
    },
    category: {
      propDefinition: [
        dataforb2b,
        "category",
      ],
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "Maximum number of results to return.",
      optional: true,
      min: 1,
      max: 100,
      default: 25,
    },
    sessionId: {
      type: "string",
      label: "Session ID",
      description: "Session identifier returned by a previous call. Send it back to answer questions or refine the same search.",
      optional: true,
    },
    enrichLive: {
      propDefinition: [
        dataforb2b,
        "enrichLive",
      ],
      default: false,
    },
    answers: {
      type: "object",
      label: "Answers",
      description: "Answers to the questions asked by the reasoning engine in a previous `needs_input` response, as an object mapping question ID to answer. Example: `{\"q_abc123\": \"France\", \"q_def456\": \"fintech\"}`. Requires **Session ID** to be set.",
      optional: true,
    },
  },
  async run({ $ }) {
    if (this.answers && Object.keys(this.answers).length > 0 && !this.sessionId) {
      throw new ConfigurationError("Session ID is required when providing answers to reasoning engine questions.");
    }

    const response = await this.dataforb2b.reasoningSearch({
      $,
      data: {
        query: this.query,
        category: this.category,
        max_results: this.maxResults,
        session_id: this.sessionId,
        enrich_live: this.enrichLive,
        answers: this.answers,
      },
    });

    if (response.status === "needs_input") {
      $.export("$summary", `Reasoning search requires clarification: ${(response.questions ?? []).map((q) => q.text).join("; ")}`);
      return response;
    }

    const resultCount = (response.results ?? []).length;
    $.export("$summary", `Reasoning search returned ${resultCount} result${resultCount === 1
      ? ""
      : "s"}`);
    return response;
  },
};
