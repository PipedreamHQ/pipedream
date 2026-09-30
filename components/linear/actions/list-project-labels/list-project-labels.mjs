import listProjectLabels from "@pipedream/linear_app/actions/list-project-labels/list-project-labels.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */
/* eslint-disable pipedream/required-properties-version */

export default {
  ...listProjectLabels,
  ...utils.getAppProps(listProjectLabels),
  key: "linear-list-project-labels",
  description: "List available project labels in the Linear workspace. Use this to discover valid label IDs when creating or updating projects. Returns `{nodes, pageInfo}`, where each node includes `id`, `name`, and optional `color`. If `pageInfo.hasNextPage` is `true`, call again with `after` set to `pageInfo.endCursor` to fetch more. Example: returns `{nodes: [{id: \"9a1b2c3d-0000-0000-0000-000000000007\", name: \"Frontend\", color: \"#0ea5e9\"}], pageInfo: {endCursor: \"9a1b2c3d-0000-0000-0000-000000000007\", hasNextPage: false}}`. [See the documentation](https://studio.apollographql.com/public/Linear-API/variant/current/schema/reference/objects/Query?query=projectLabels).",
  version: "0.0.1",
  ai: "optimized",
};
