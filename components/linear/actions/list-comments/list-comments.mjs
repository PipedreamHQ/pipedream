import listComments from "@pipedream/linear_app/actions/list-comments/list-comments.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */
/* eslint-disable pipedream/required-properties-version */

export default {
  ...listComments,
  ...utils.getAppProps(listComments),
  key: "linear-list-comments",
  description: "List comments in Linear. **Pass `issueId` to read one issue's discussion** — resolve the issue first with **Search Issues** or **Get Issue**. Without it this searches comments across the ENTIRE workspace, and a `body` search alone will surface unrelated comments from other teams that happen to share a word. **Response size matters here:** comment bodies are free text and each comment carries nested `user`, `issue` and `reactionData`; pass `fields: \"compact\"` (`id,body,createdAt,url`) to read a thread without the surrounding metadata. [See the documentation](https://studio.apollographql.com/public/Linear-API/variant/current/schema/reference/objects/Query?query=comments).",
  version: "0.2.2",
};
