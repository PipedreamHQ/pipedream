import createComment from "@pipedream/linear_app/actions/create-comment/create-comment.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */
/* eslint-disable pipedream/required-properties-version */

export default {
  ...createComment,
  ...utils.getAppProps(createComment),
  key: "linear-create-comment",
  description: "Add a comment to a Linear issue. Use **Search Issues** to find the target issue ID first. Returns the new comment's ID and body. Example: `issueId: \"iss_01abc\"`, `body: \"Fixed in PR #123.\"` → returns `{success: true, comment: {id: \"cmt_xyz\", body: \"Fixed in PR #123.\"}}`. [See the documentation](https://studio.apollographql.com/public/Linear-API/variant/current/schema/reference/objects/Mutation?query=comment)",
  version: "0.0.3",
  ai: "optimized",
};
