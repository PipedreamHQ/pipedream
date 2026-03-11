import updateInitiative from "@pipedream/linear_app/actions/update-initiative/update-initiative.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */
/* eslint-disable pipedream/required-properties-version */

export default {
  ...updateInitiative,
  ...utils.getAppProps(updateInitiative),
  key: "linear-update-initiative",
  description: "Update an initiative in Linear. [See the documentation](https://studio.apollographql.com/public/Linear-API/variant/current/schema/reference/objects/Mutation?query=initiativeupdate).",
  version: "0.0.1",
};
