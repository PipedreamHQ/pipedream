import listWorkflowStates from "@pipedream/linear_app/actions/list-workflow-states/list-workflow-states.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */
/* eslint-disable pipedream/required-properties-version */

export default {
  ...listWorkflowStates,
  ...utils.getAppProps(listWorkflowStates),
  key: "linear-list-workflow-states",
  description: "List workflow states (statuses) in Linear. Returns state IDs, names, types (e.g. backlog, started, completed, cancelled), and team info. Optionally filter by team (use the **Get Teams** action to discover valid team IDs, e.g. `4e80f53c-da9e-4dee-b14e-2cab3e2e8716`). Example: `teamId: \"9d1c3f7e-...\"` → returns `{nodes: [{id: \"state_done_xyz\", name: \"Done\", type: \"completed\"}, {id: \"state_prog_abc\", name: \"In Progress\", type: \"started\"}], pageInfo: {endCursor: \"...\", hasNextPage: false}}`. [See the documentation](https://studio.apollographql.com/public/Linear-API/variant/current/schema/reference/objects/Query?query=workflowStates).",
  version: "0.0.3",
  ai: "optimized",
};
