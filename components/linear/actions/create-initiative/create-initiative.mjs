import createInitiative from "@pipedream/linear_app/actions/create-initiative/create-initiative.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */
/* eslint-disable pipedream/required-properties-version */

export default {
  ...createInitiative,
  ...utils.getAppProps(createInitiative),
  key: "linear-create-initiative",
  description: "Create an initiative in Linear. [See the documentation](https://studio.apollographql.com/public/Linear-API/variant/current/schema/reference/objects/Mutation?query=initiativeCreate).",
  version: "0.0.1",
};
