import createProjectUpdate from "@pipedream/linear_app/actions/create-project-update/create-project-update.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */
/* eslint-disable pipedream/required-properties-version */

export default {
  ...createProjectUpdate,
  ...utils.getAppProps(createProjectUpdate),
  key: "linear-create-project-update",
  description: "Post a status update on a Linear project. Use **List Projects** first to obtain the project ID. Updates appear in the project's activity feed. Example: `projectId: \"a1b2c3d4-0000-0000-0000-000000000001\"`, `body: \"Q3 milestone complete; all P0 issues resolved.\"`, `health: \"onTrack\"` → returns `{success: true, projectUpdate: {id: \"pu_01xyz\"}}`. [See the documentation](https://studio.apollographql.com/public/Linear-API/variant/current/schema/reference/objects/Mutation?query=projectUpdateCreate).",
  version: "0.0.2",
  ai: "optimized",
};
