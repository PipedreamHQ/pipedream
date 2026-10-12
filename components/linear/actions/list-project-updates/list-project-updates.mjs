import listProjectUpdates from "@pipedream/linear_app/actions/list-project-updates/list-project-updates.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */
/* eslint-disable pipedream/required-properties-version */

export default {
  ...listProjectUpdates,
  ...utils.getAppProps(listProjectUpdates),
  key: "linear-list-project-updates",
  description: "List project updates in Linear, optionally scoped to a single project. Use **List Projects** to find a project ID. Returns update objects with `id`, `body`, `health`, `createdAt`, and author. Example: `projectId: \"a1b2c3d4-0000-0000-0000-000000000001\"`, `first: 10` → returns `{nodes: [{id: \"pu_01xyz\", body: \"Q3 milestone complete.\", health: \"onTrack\"}], pageInfo: {endCursor: \"...\", hasNextPage: false}}`. [See the documentation](https://studio.apollographql.com/public/Linear-API/variant/current/schema/reference/objects/ProjectUpdateConnection?query=projectUpdates).",
  version: "0.0.1",
  ai: "optimized",
};
