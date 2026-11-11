import updateIssue from "@pipedream/linear_app/actions/update-issue/update-issue.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */

export default {
  ...updateIssue,
  ...utils.getAppProps(updateIssue),
  key: "linear-update-issue",
  description: "Updates an existing Linear issue: its title, description, state, assignee, labels, project, priority or team. All fields are optional; only provided fields are changed — prior values are preserved for any omitted field. To create an issue, use **Create Issue** instead. `labelIds` replaces the issue's whole label set; to take off a single label and keep the rest, use **Remove Label from Issue**. Use **Search Issues** for the issue ID, **List Workflow States** for state IDs, **List Users** for assignee IDs, **List Labels** for label IDs, and **Get Teams** for team IDs. Returns the updated issue's `id`, `identifier`, `title`, `url` and `state`. Example: `issueId: \"7df5e7f9-a357-4539-ae94-4a004fec635f\"`, `stateId: \"a1b2c3d4-0000-0000-0000-000000000002\"` → returns `{success: true, issue: {id: \"7df5e7f9-a357-4539-ae94-4a004fec635f\", identifier: \"ENG-42\", title: \"Fix login redirect on mobile\", url: \"https://linear.app/acme/issue/ENG-42/fix-login-redirect-on-mobile\", state: {name: \"Done\"}}}`. [See the documentation](https://linear.app/developers/graphql#creating-and-editing-issues).",
  version: "0.1.17",
  ai: "optimized",
};
