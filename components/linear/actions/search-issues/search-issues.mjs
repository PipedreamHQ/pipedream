import searchIssues from "@pipedream/linear_app/actions/search-issues/search-issues.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */
/* eslint-disable pipedream/required-properties-version */

export default {
  ...searchIssues,
  ...utils.getAppProps(searchIssues),
  key: "linear-search-issues",
  description: "Searches Linear issues by team, project, assignee, labels, state, or text query. Supports pagination, ordering, and archived issues. Returns array of matching issues. Uses OAuth authentication. **Response size matters here:** by default every field of every matching issue is returned, including the full `description` body and nested `team`, `project`, `cycle` and `parent` objects — measured at 20-34 KB for a single search on a real workspace, enough to exceed an AI agent's tool-output ceiling. `fields: \"compact\"` returns `id,identifier,title,state,assignee,priorityLabel`, which answers most \"find the issue about X\" questions; fetch the body with **Get Issue** once you know which one you want. See Linear docs for additional info [here](https://linear.app/developers/graphql).",
  version: "0.7.0",
};
