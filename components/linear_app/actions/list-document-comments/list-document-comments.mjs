import linearApp from "../../linear_app.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "linear_app-list-document-comments",
  name: "List Document Comments",
  description: "List the comments on a Linear document. Use **Search Documents** to find the document ID. For comments on issues use **List Comments** instead. Returns comment objects with `id`, `body`, `createdAt`, `user` (author), `parent` (the comment being replied to, or null), and `resolvedAt` (null if unresolved). Supports pagination via `first`/`after`. Example: `documentId: \"10b5bc2940c7\"`, `first: 10` → returns `{nodes: [{id: \"cmt_xyz\", body: \"Can we tighten the timeline?\", createdAt: \"2024-01-15T10:00:00Z\", parent: null, resolvedAt: null, user: {id: \"usr_1\", name: \"Ada\"}}], pageInfo: {endCursor: \"...\", hasNextPage: false}}`. [See the documentation](https://studio.apollographql.com/public/Linear-API/variant/current/schema/reference/objects/Document)",
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
      description: "The document to list comments for: its UUID or slugId (the short code at the end of the document URL, e.g. `10b5bc2940c7`). Use **Search Documents** to find document IDs.",
    },
    orderBy: {
      propDefinition: [
        linearApp,
        "orderBy",
      ],
    },
    first: {
      propDefinition: [
        linearApp,
        "first",
      ],
    },
    after: {
      propDefinition: [
        linearApp,
        "after",
      ],
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: "Optional list of field names to include in each returned comment object. When omitted, the full comment payload is returned. Pass a subset to reduce response size, e.g. `[\"id\", \"body\", \"createdAt\"]`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const document = await this.linearApp.listDocumentComments({
      id: this.documentId,
      orderBy: this.orderBy,
      first: utils.clampFirst(this.first),
      after: this.after,
    });
    if (!document) {
      throw new Error(`Document not found: ${this.documentId}`);
    }

    const {
      nodes, pageInfo,
    } = document.comments;

    $.export("$summary", `Found ${nodes.length} comment${nodes.length === 1
      ? ""
      : "s"}`);

    return {
      nodes: nodes.map((comment) => utils.pickFields(comment, this.fields)),
      pageInfo,
    };
  },
};
