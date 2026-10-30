import linearApp from "../../linear_app.app.mjs";
import utils from "../../common/utils.mjs";

const DEFAULT_FIELDS = [
  "id",
  "contentDataSnapshotAt",
  "actorIds",
];

export default {
  key: "linear_app-get-document-content-history",
  name: "Get Document Content History",
  description:
    "Return the revision history for a Linear document — each entry shows when the content changed and which users made the edit."
    + " Provide the document's UUID or slugId (same format as **Get Document**)."
    + " Use **Search Documents** to find the document ID."
    + " Each history entry includes `id`, `contentDataSnapshotAt` (timestamp of the snapshot), and `actorIds` (list of user UUIDs who contributed to that revision)."
    + " `contentData` is a serialized TipTap rich-text snapshot — include it in `fields` only when you need to render or diff the raw document structure; for a quick summary, `contentDataSnapshotAt` and `actorIds` are sufficient."
    + " The tool makes two API calls internally: first it resolves the document to its content ID, then it fetches the history."
    + " Example: `documentId: \"10b5bc2940c7\"` → returns `[{id: \"9d3c86fd-...\", contentDataSnapshotAt: \"2025-03-01T14:22:10Z\", actorIds: [\"3fd8c25f-...\"]}]`."
    + " [See the documentation](https://studio.apollographql.com/public/Linear-API/variant/current/schema/reference/objects/Query?query=documentContentHistory).",
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
      description: "Field names to return for each history entry. Defaults to a compact set: id, contentDataSnapshotAt, actorIds. Add `contentData` only when you need the full TipTap rich-text snapshot for diffing or rendering — it is a large nested object. e.g. `[\"id\", \"contentDataSnapshotAt\", \"contentData\"]`",
      optional: true,
    },
  },
  async run({ $ }) {
    const doc = await this.linearApp.getDocumentForHistory({
      id: this.documentId,
    });
    if (!doc) {
      throw new Error(`Document not found: ${this.documentId}`);
    }

    const {
      success, history,
    } = await this.linearApp.getDocumentContentHistory({
      id: doc.documentContentId,
    });

    if (!success) {
      throw new Error(`Failed to retrieve content history for document: ${this.documentId}`);
    }

    $.export("$summary", `Found ${history.length} revision${history.length === 1
      ? ""
      : "s"} for document ${doc.id}`);

    const fieldsList = this.fields?.length
      ? this.fields
      : DEFAULT_FIELDS;
    return history.map((entry) => utils.pickFields(entry, fieldsList));
  },
};
