import createProject from "@pipedream/linear_app/actions/create-project/create-project.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */
/* eslint-disable pipedream/required-properties-version */

export default {
  ...createProject,
  ...utils.getAppProps(createProject),
  key: "linear-create-project",
  description: "Create a new project in Linear to track a body of work. Projects group related issues within a team. Use **Get Teams** for team IDs, **List Project Statuses** to find status IDs, **List Users** for member IDs, and **List Project Labels** for label IDs. Example: `teamId: \"9d1c3f7e-...\"`, `projectName: \"Mobile App v2\"`, `statusId: \"s2abc\"` → returns `{success: true, project: {id: \"proj_01\", name: \"Mobile App v2\"}}`. [See the documentation](https://studio.apollographql.com/public/Linear-API/variant/current/schema/reference/inputs/ProjectCreateInput).",
  version: "0.0.5",
  ai: "optimized",
};
