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
  },
  async run({ $ }) {
    const response = await this.app.askKnowledgeGraph({
      $,
      data: {
        graph_ids: this.graphIds,
        question: this.question,
        subqueries: this.subqueries,
        stream: false,
      },
    });
    $.export("$summary", `Answered question against ${this.graphIds.length} Knowledge Graph${this.graphIds.length === 1
      ? ""
      : "s"}`);
    return response;
  },
};
