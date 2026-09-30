import updateIssue from "@pipedream/linear_app/actions/update-issue/update-issue.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */

export default {
  ...updateIssue,
  ...utils.getAppProps(updateIssue),
  key: "linear-update-issue",
  description: "Updates an existing Linear issue. All fields are optional; only provided fields are changed — prior values are preserved for any omitted field. Use **Get Teams** for team IDs, **List Workflow States** for state IDs, **List Users** for assignee IDs, **List Labels** for label IDs, and **Search Issues** for the issue ID. Example: `issueId: \"iss_01abc\"`, `stateId: \"state_done_xyz\"` → returns `{success: true, issue: {id: \"iss_01abc\", identifier: \"ENG-42\", state: {name: \"Done\"}}}`. [See the documentation](https://linear.app/developers/graphql#creating-and-editing-issues).",
  version: "0.1.18",
  ai: "optimized",
};
