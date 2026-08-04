// x-pd-ai: optimized
import app from "../../writer.app.mjs";
import {
  GRAPH_DEFAULT_FIELDS,
  MAX_RESULTS,
} from "../../common/constants.mjs";
import { pluck } from "../../common/utils.mjs";

export default {
  key: "writer-list-knowledge-graphs",
  name: "List Knowledge Graphs",
  description: "List the Knowledge Graphs in your Writer workspace. Knowledge Graphs are the retrieval (RAG) sources you can query. "
    + "Use this to find a graph by name/topic and resolve its `id`, then pass the id(s) to **Ask Knowledge Graph** to ask a grounded question. "
    + `Auto-paginates up to ${MAX_RESULTS} graphs. `
    + "Example: to get just the names of your graphs, call with `fields=[\"name\"]` -> returns records like `{ id: \"...\", name: \"Isla Nublar Field Guide\" }`. "
    + "[See the documentation](https://dev.writer.com/api-reference/kg-api/list-graphs)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    fields: {
      type: "string[]",
      label: "Fields",
      optional: true,
      description: "Field names to return for each Knowledge Graph (`id` is always included). "
        + `Defaults to: ${GRAPH_DEFAULT_FIELDS.join(", ")}. `
        + "Available fields include `name`, `description`, `type`, `file_status`, `created_at`, `urls`. Pass only what you need to keep responses small.",
    },
    maxResults: {
      propDefinition: [
        app,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const results = await this.app.paginate({
      $,
      resourceFn: this.app.listKnowledgeGraphs,
      max: this.maxResults,
    });

    const fields = this.fields?.length
      ? this.fields
      : GRAPH_DEFAULT_FIELDS;
    const output = results.map((item) => pluck(item, fields));

    $.export("$summary", `Found ${output.length} Knowledge Graph${output.length === 1
      ? ""
      : "s"}`);
    return output;
  },
};
