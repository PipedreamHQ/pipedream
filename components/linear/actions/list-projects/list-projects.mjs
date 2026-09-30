import listProjects from "@pipedream/linear_app/actions/list-projects/list-projects.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */
/* eslint-disable pipedream/required-properties-version */

export default {
  ...listProjects,
  ...utils.getAppProps(listProjects),
  key: "linear-list-projects",
  description: "List projects in Linear, optionally filtered by team. Returns project objects including `id`, `name`, `state`, `priority`, and progress history. Use **Get Teams** to find team IDs. Use the optional `fields` prop to narrow the response when only specific fields are needed (reduces context for large result sets). Example: `teamId: \"9d1c3f7e-...\"` → returns `{nodes: [{id: \"proj_01\", name: \"Mobile App v2\", state: {name: \"In Progress\"}}], pageInfo: {endCursor: \"...\", hasNextPage: false}}`. [See the documentation](https://studio.apollographql.com/public/Linear-API/variant/current/schema/reference/objects/ProjectConnection?query=projects).",
  version: "0.0.7",
  ai: "optimized",
};
