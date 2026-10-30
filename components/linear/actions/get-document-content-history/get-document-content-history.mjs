import getDocumentContentHistory from "@pipedream/linear_app/actions/get-document-content-history/get-document-content-history.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */
/* eslint-disable pipedream/required-properties-version */

export default {
  ...getDocumentContentHistory,
  ...utils.getAppProps(getDocumentContentHistory),
  key: "linear-get-document-content-history",
  description: "Return the revision history for a Linear document — each entry shows when the content changed and which users made the edit. Provide the document's UUID or slugId (same format as **Get Document**). Use **Search Documents** to find the document ID. Each history entry includes `id`, `contentDataSnapshotAt` (timestamp of the snapshot), and `actorIds` (list of user UUIDs who contributed to that revision). `contentData` is a serialized TipTap rich-text snapshot — include it in `fields` only when you need to render or diff the raw document structure; for a quick summary, `contentDataSnapshotAt` and `actorIds` are sufficient. Example: `documentId: \"10b5bc2940c7\"` → returns `[{id: \"9d3c86fd-...\", contentDataSnapshotAt: \"2025-03-01T14:22:10Z\", actorIds: [\"3fd8c25f-...\"]}]`. [See the documentation](https://linear.app/developers/graphql).",
  version: "0.0.1",
  ai: "optimized",
};
