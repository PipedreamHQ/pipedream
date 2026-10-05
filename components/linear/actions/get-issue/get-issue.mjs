import getIssue from "@pipedream/linear_app/actions/get-issue/get-issue.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */
/* eslint-disable pipedream/required-properties-version */

export default {
  ...getIssue,
  ...utils.getAppProps(getIssue),
  key: "linear-get-issue",
  description: "Retrieve a single Linear issue by its UUID or human-readable identifier. Provide exactly one of `issueId` (UUID) or `issueIdentifier` (e.g. `ENG-42`). Returns complete issue details: title, description, state, assignee, team, project, labels, and timestamps. Use the optional `fields` prop to narrow the response to only the keys you need (reduces context for large result sets). Example: `issueIdentifier: \"ENG-42\"` → returns `{id: \"9d1c3f7e-2b48-4c6a-9f1e-5a7b8c9d0e1f\", identifier: \"ENG-42\", title: \"Fix login redirect\", state: {name: \"In Progress\"}}`. [See the documentation](https://studio.apollographql.com/public/Linear-API/variant/current/schema/reference/objects/Query?query=issue).",
  version: "0.1.17",
  ai: "optimized",
};
