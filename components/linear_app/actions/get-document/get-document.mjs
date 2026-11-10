import linearApp from "../../linear_app.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "linear_app-get-document",
  name: "Get Document",
  description:
    "Fetch a single Linear document by its UUID or slugId and return the full markdown content plus metadata."
    + " Use when you need to read, show, or display the full contents of a document — **Search Documents** does not return the `content` field."
    + " Workflow: first call **Search Documents** to find the document `id` or `slugId`, then call this tool with that identifier."
    + " Provide the document UUID (e.g. `a1b2c3d4-0000-0000-0000-000000000001`) or slugId (the short code at the end of the document URL, e.g. `10b5bc2940c7`)."
    + " The optional `fields` prop narrows the response to only the keys you need."
    + " Example: `documentId: \"10b5bc2940c7\"` → returns `{id: \"29a25062-...\", title: \"Q3 Hiring Plan\", content: \"# Q3 Hiring Plan\\n\\nWe are looking for...\", url: \"https://linear.app/.../document/q3-hiring-plan-10b5bc2940c7\"}`."
    + " [See the documentation](https://studio.apollographql.com/public/Linear-API/variant/current/schema/reference/objects/Query?query=document).",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    linearApp,
    documentId: {
      propDefinition: [
        linearApp,
        "documentId",
      ],
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: "Optional list of field names to include in the returned document object. When omitted, the full document payload is returned (id, title, slugId, url, content, icon, color, createdAt, updatedAt, archivedAt, documentContentId, project, initiative, creator). Pass a subset to reduce response size, e.g. `[\"id\", \"title\", \"content\"]`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const document = await this.linearApp.getDocument({
      id: this.documentId,
    });
    if (!document) {
      throw new Error(`Document not found: ${this.documentId}`);
    }
    $.export("$summary", `Fetched document: ${document.title}`);
    return utils.pickFields(document, this.fields);
  },
};
