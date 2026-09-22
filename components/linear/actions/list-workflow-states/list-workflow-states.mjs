import listWorkflowStates from "@pipedream/linear_app/actions/list-workflow-states/list-workflow-states.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */
/* eslint-disable pipedream/required-properties-version */

export default {
  ...listWorkflowStates,
  ...utils.getAppProps(listWorkflowStates),
  key: "linear-list-workflow-states",
  description: "List workflow states (statuses) in Linear. Returns state IDs, names, types (e.g. backlog, started, completed, cancelled), and team info. Optionally filter by team. Uses OAuth authentication. [See the documentation](https://studio.apollographql.com/public/Linear-API/variant/current/schema/reference/objects/Query?query=workflowStates).",
  version: "0.0.1",
};
