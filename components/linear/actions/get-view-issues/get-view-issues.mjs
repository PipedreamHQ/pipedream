import getViewIssues from "@pipedream/linear_app/actions/get-view-issues/get-view-issues.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */
/* eslint-disable pipedream/required-properties-version */

export default {
  ...getViewIssues,
  ...utils.getAppProps(getViewIssues),
  key: "linear-get-view-issues",
  description: "Retrieve issues filtered by a saved custom view in Linear. Custom views encapsulate pre-configured filters (team, state, assignee, labels, etc.). Use **List Views** to find the view ID. Use the optional `fields` prop to narrow the response to only the keys you need (reduces context for large result sets). Example: `viewId: \"cv1b2c3d4-...\"` → returns `{nodes: [{id: \"iss_01\", identifier: \"ENG-42\", title: \"Fix login\", state: {name: \"In Progress\"}}], pageInfo: {endCursor: \"...\", hasNextPage: false}}`. [See the documentation](https://studio.apollographql.com/public/Linear-API/variant/current/schema/reference/objects/Query?query=customView)",
  version: "0.0.3",
  ai: "optimized",
};
