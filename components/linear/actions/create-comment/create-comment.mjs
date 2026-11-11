import createComment from "@pipedream/linear_app/actions/create-comment/create-comment.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */
/* eslint-disable pipedream/required-properties-version */

export default {
  ...createComment,
  ...utils.getAppProps(createComment),
  key: "linear-create-comment",
  description: "Adds a markdown comment to a Linear issue. Use it to comment on an issue; to change the issue itself (state, assignee, title), use **Update Issue** instead. Use **Search Issues** to find the target issue ID first. Returns the new comment's `id`, `body` and `url`, plus the issue's `id`, `identifier` and `url`. Example: `issueId: \"7df5e7f9-a357-4539-ae94-4a004fec635f\"`, `body: \"Fixed in PR #123.\"` → returns `{success: true, comment: {id: \"5c3b1f0e-0000-0000-0000-000000000009\", body: \"Fixed in PR #123.\", url: \"https://linear.app/acme/issue/ENG-42/fix-login-redirect-on-mobile#comment-5c3b1f0e\", issue: {identifier: \"ENG-42\"}}}`. [See the documentation](https://studio.apollographql.com/public/Linear-API/variant/current/schema/reference/objects/Mutation?query=comment)",
  version: "0.0.4",
  ai: "optimized",
};
