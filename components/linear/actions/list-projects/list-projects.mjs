import listProjects from "@pipedream/linear_app/actions/list-projects/list-projects.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */
/* eslint-disable pipedream/required-properties-version */

export default {
  ...listProjects,
  ...utils.getAppProps(listProjects),
  key: "linear-list-projects",
  description: "List projects in Linear. [See the documentation](https://studio.apollographql.com/public/Linear-API/variant/current/schema/reference/objects/ProjectConnection?query=projects).",
  version: "0.0.1",
};
