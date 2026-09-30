import searchIssues from "@pipedream/linear_app/actions/search-issues/search-issues.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */
/* eslint-disable pipedream/required-properties-version */

export default {
  ...searchIssues,
  ...utils.getAppProps(searchIssues),
  key: "linear-search-issues",
  description: "Search Linear issues by team, project, assignee, labels, state, or text query. Returns up to 200 matching issues (paginated internally). Use **Get Teams** for team IDs, **List Projects** for project IDs, **List Workflow States** for state IDs, **List Users** for assignee IDs, and **List Labels** for label names. Use the optional `fields` prop to narrow the response to only the keys you need (reduces context size for large result sets). Example: `teamId: \"9d1c3f7e-...\", query: \"login redirect\"` → returns `[{id: \"iss_01\", identifier: \"ENG-42\", title: \"Fix login redirect on mobile\", state: {name: \"In Progress\"}}]`. [See the documentation](https://linear.app/developers/graphql).",
  version: "0.2.18",
  ai: "optimized",
};
