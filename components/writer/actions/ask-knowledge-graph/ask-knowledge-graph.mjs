// x-pd-ai: optimized
import app from "../../writer.app.mjs";

export default {
  key: "writer-ask-knowledge-graph",
  name: "Ask Knowledge Graph",
  description: "Ask a natural-language question grounded in one or more of your Writer Knowledge Graphs (RAG). Returns an answer with its sources. "
    + "Use **List Knowledge Graphs** first to resolve the graph `id`(s) you want to query. "
    + "For free-form generation not grounded in your documents, use **Send Prompt** instead. "
    + "Example: call with `graphIds=[\"a1b2...\"]` and `question=\"What are the park hours?\"` -> returns `{ question, answer, sources, references }`. "
    + "If a graph has no relevant content it returns a graceful 'no relevant information' answer rather than an error. "
    + "[See the documentation](https://dev.writer.com/api-reference/kg-api/question)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    graphIds: {
      type: "string[]",
      label: "Graph IDs",
      description: "One or more Knowledge Graph UUIDs to query (at least one). Resolve ids with **List Knowledge Graphs**.",
    },
    question: {
      type: "string",
      label: "Question",
      description: "The natural-language question to answer from the selected Knowledge Graph(s). Example: `What are the park hours?`",
    },
    subqueries: {
      type: "boolean",
      label: "Subqueries",
      description: "Whether to break the question into subqueries for a more thorough search. Defaults to `false`.",
      optional: true,
    },
    queryConfig: {
      type: "object",
      label: "Query Config",
      description: "Advanced configuration for the Knowledge Graph query, controlling search behavior, grounding, and citations. All keys are optional — supply only the ones you want to override. Supported keys:\n"
        + "- `max_subquestions` (integer, 1-10, default `6`) — max subquestions generated for complex queries. Higher = more detail, lower = faster.\n"
        + "- `search_weight` (integer, 0-100, default `50`) — ranking weight; higher (→100) favors keyword matching, lower (→0) favors semantic similarity.\n"
        + "- `grounding_level` (number, 0.0-1.0, default `0`) — how closely answers stick to source material; higher (→1.0) allows more creative interpretation, lower (→0.0) stays grounded.\n"
        + "- `max_snippets` (integer, 1-60, default `30`) — max context snippets retrieved. Values below 5 may return no results; recommended range 5-25.\n"
        + "- `max_tokens` (integer, 100-8000, default `4000`) — max tokens in the generated answer. Higher = longer answers, lower = shorter/faster.\n"
        + "- `keyword_threshold` (number, 0.0-1.0, default `0.7`) — keyword-match strictness; higher (→1.0) requires stronger keyword matches.\n"
        + "- `semantic_threshold` (number, 0.0-1.0, default `0.7`) — semantic-similarity strictness; higher (→1.0) requires stronger similarity.\n"
        + "- `inline_citations` (boolean, default `false`) — include inline citations in the response showing which sources were used.\n"
        + "Example: `{ \"max_subquestions\": 4, \"grounding_level\": 0.2, \"inline_citations\": true }`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.askKnowledgeGraph({
      $,
      data: {
        graph_ids: this.graphIds,
        question: this.question,
        subqueries: this.subqueries,
        query_config: this.queryConfig,
        stream: false,
      },
    });
    $.export("$summary", `Answered question against ${this.graphIds.length} Knowledge Graph${this.graphIds.length === 1
      ? ""
      : "s"}`);
    return response;
  },
};
