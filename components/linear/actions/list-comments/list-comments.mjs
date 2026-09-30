import listComments from "@pipedream/linear_app/actions/list-comments/list-comments.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */
/* eslint-disable pipedream/required-properties-version */

export default {
  ...listComments,
  ...utils.getAppProps(listComments),
  key: "linear-list-comments",
  description: "List comments in Linear, optionally filtered by issue or body text. Returns comment objects with `id`, `body`, `createdAt`, and author details. Supports pagination via `first`/`after`. Use **Search Issues** to find an issue ID to filter by. Example: `issueId: \"iss_01abc\", body: \"PR #\"` → returns `{nodes: [{id: \"cmt_xyz\", body: \"Fixed in PR #123.\", createdAt: \"2024-01-15T10:00:00Z\"}], pageInfo: {endCursor: \"...\", hasNextPage: false}}`. [See the documentation](https://studio.apollographql.com/public/Linear-API/variant/current/schema/reference/objects/Query?query=comments)",
  version: "0.0.4",
  ai: "optimized",
};
