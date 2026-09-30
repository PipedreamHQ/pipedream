import listProjectStatuses from "@pipedream/linear_app/actions/list-project-statuses/list-project-statuses.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */
/* eslint-disable pipedream/required-properties-version */

export default {
  ...listProjectStatuses,
  ...utils.getAppProps(listProjectStatuses),
  key: "linear-list-project-statuses",
  description: "List available project statuses in the Linear workspace. Use this to discover valid status IDs when creating or updating projects. Returns `{nodes, pageInfo}`, where each node includes `id`, `name`, and `type`. If `pageInfo.hasNextPage` is `true`, call again with `after` set to `pageInfo.endCursor` to fetch more. Example: returns `{nodes: [{id: \"5a1b2c3d-0000-0000-0000-000000000006\", name: \"Planned\", type: \"planned\"}], pageInfo: {endCursor: \"5a1b2c3d-0000-0000-0000-000000000006\", hasNextPage: false}}`. [See the documentation](https://studio.apollographql.com/public/Linear-API/variant/current/schema/reference/objects/Query?query=projectStatuses).",
  version: "0.0.2",
  ai: "optimized",
};
