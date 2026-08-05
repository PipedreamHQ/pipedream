import listProjects from "@pipedream/linear_app/actions/list-projects/list-projects.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */
/* eslint-disable pipedream/required-properties-version */

export default {
  ...listProjects,
  ...utils.getAppProps(listProjects),
  key: "linear-list-projects",
  description: "List projects in Linear. **Response size matters here:** by default every field of every project is returned, including five per-project time-series arrays (`issueCountHistory`, `scopeHistory`, `completedScopeHistory`, `completedIssueCountHistory`, `inProgressScopeHistory`) that dominate the payload — measured at ~1 KB per project, so even a handful of projects can crowd out an AI agent's context. `fields: \"compact\"` returns `id,name,description,state,status,progress`, which is what a question about projects normally needs. [See the documentation](https://studio.apollographql.com/public/Linear-API/variant/current/schema/reference/objects/ProjectConnection?query=projects).",
  version: "0.1.0",
};
