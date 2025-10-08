import createProject from "@pipedream/linear_app/actions/create-project/create-project.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */
/* eslint-disable pipedream/required-properties-version */

export default {
  ...createProject,
  ...utils.getAppProps(createProject),
  key: "linear-create-project",
  description: "Create a project in Linear. [See the documentation](https://studio.apollographql.com/public/Linear-API/variant/current/schema/reference/inputs/ProjectCreateInput).",
  version: "0.0.1",
};
