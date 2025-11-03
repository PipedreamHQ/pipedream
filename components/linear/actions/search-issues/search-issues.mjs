import searchIssues from "@pipedream/linear_app/actions/search-issues/search-issues.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */
/* eslint-disable pipedream/required-properties-version */

export default {
  ...searchIssues,
  ...utils.getAppProps(searchIssues),
  key: "linear-search-issues",
  description: "Searches Linear issues by team, project, assignee, labels, state, or text query. Supports pagination, ordering, and archived issues. Returns array of matching issues. Uses OAuth authentication. See Linear docs for additional info [here](https://linear.app/developers/graphql).",
  version: "0.2.13",
};
