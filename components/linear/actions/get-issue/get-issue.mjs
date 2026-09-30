import getIssue from "@pipedream/linear_app/actions/get-issue/get-issue.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */
/* eslint-disable pipedream/required-properties-version */

export default {
  ...getIssue,
  ...utils.getAppProps(getIssue),
  key: "linear-get-issue",
  description: "Retrieve a single Linear issue by its UUID or human-readable identifier. Provide exactly one of `issueId` (UUID) or `issueIdentifier` (e.g. `ENG-42`). Returns complete issue details: title, description, state, assignee, team, project, labels, and timestamps. Use the optional `fields` prop to narrow the response to only the keys you need (reduces context for large result sets). Example: `issueIdentifier: \"ENG-42\"` → returns `{id: \"iss_01abc\", identifier: \"ENG-42\", title: \"Fix login redirect\", state: {name: \"In Progress\"}}`. [See the documentation](https://linear.app/developers/graphql).",
  version: "0.1.17",
  ai: "optimized",
};
