import createDocumentComment from "@pipedream/linear_app/actions/create-document-comment/create-document-comment.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */
/* eslint-disable pipedream/required-properties-version */

export default {
  ...createDocumentComment,
  ...utils.getAppProps(createDocumentComment),
  key: "linear-create-document-comment",
  description: "Add a comment to a Linear document, or reply to an existing comment on it. Use **Search Documents** to find the document ID, and **List Document Comments** to find a comment ID to reply to. For comments on issues use **Create Comment** instead. A reply's parent must be a comment on the same document. Returns `success` and the new comment's `id`, `body`, `createdAt`, `parent`, and author. Example: `documentId: \"10b5bc2940c7\"`, `body: \"Looks good, one question on the rollout plan.\"` → returns `{success: true, comment: {id: \"cmt_xyz\", body: \"Looks good, one question on the rollout plan.\", parent: null}}`. [See the documentation](https://studio.apollographql.com/public/Linear-API/variant/current/schema/reference/objects/Mutation?query=commentCreate)",
  version: "0.0.1",
  ai: "optimized",
};
