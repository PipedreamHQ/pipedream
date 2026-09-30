import listUsers from "@pipedream/linear_app/actions/list-users/list-users.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */
/* eslint-disable pipedream/required-properties-version */

export default {
  ...listUsers,
  ...utils.getAppProps(listUsers),
  key: "linear-list-users",
  description: "List members of the Linear workspace. Use this to discover valid user IDs for assigning issues or initiatives. Returns `{nodes, pageInfo}`, where each node includes `id`, `name`, and `email`. If `pageInfo.hasNextPage` is `true`, call again with `after` set to `pageInfo.endCursor` to fetch more. Example: call with no filters to list all members → returns `{nodes: [{id: \"abc123\", name: \"Alice\", email: \"alice@acme.com\"}], pageInfo: {endCursor: \"abc123\", hasNextPage: false}}`. [See the documentation](https://studio.apollographql.com/public/Linear-API/variant/current/schema/reference/objects/Query?query=users).",
  version: "0.0.2",
  ai: "optimized",
};
