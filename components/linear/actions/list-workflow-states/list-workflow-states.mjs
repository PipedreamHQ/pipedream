import listWorkflowStates from "@pipedream/linear_app/actions/list-workflow-states/list-workflow-states.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */
/* eslint-disable pipedream/required-properties-version */

export default {
  ...listWorkflowStates,
  ...utils.getAppProps(listWorkflowStates),
  key: "linear-list-workflow-states",
  description: "List workflow states (statuses) in Linear. Returns state IDs, names, types (e.g. backlog, started, completed, cancelled), and team info. Optionally filter by team. Uses OAuth authentication. **Response size matters here:** every state carries a nested `team` object, so an unfiltered call returns states × teams and grows with the size of the workspace — measured at 22 KB on a real one. Filter by `teamId` when you know the team, and pass `fields: \"compact\"` (`id,name,type`) when you just need a state id to move an issue to. [See the documentation](https://studio.apollographql.com/public/Linear-API/variant/current/schema/reference/objects/Query?query=workflowStates).",
  version: "0.2.0",
};
