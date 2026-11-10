import listDocumentComments from "@pipedream/linear_app/actions/list-document-comments/list-document-comments.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */
/* eslint-disable pipedream/required-properties-version */

export default {
  ...listDocumentComments,
  ...utils.getAppProps(listDocumentComments),
  key: "linear-list-document-comments",
  description: "List the comments on a Linear document. Use **Search Documents** to find the document ID. For comments on issues use **List Comments** instead. Returns comment objects with `id`, `body`, `createdAt`, `user` (author), `parent` (the comment being replied to, or null), and `resolvedAt` (null if unresolved). Supports pagination via `first`/`after`. Example: `documentId: \"10b5bc2940c7\"`, `first: 10` → returns `{nodes: [{id: \"cmt_xyz\", body: \"Can we tighten the timeline?\", createdAt: \"2024-01-15T10:00:00Z\", parent: null, resolvedAt: null, user: {id: \"usr_1\", name: \"Ada\"}}], pageInfo: {endCursor: \"...\", hasNextPage: false}}`. [See the documentation](https://studio.apollographql.com/public/Linear-API/variant/current/schema/reference/objects/Document)",
  version: "0.0.1",
  ai: "optimized",
};
