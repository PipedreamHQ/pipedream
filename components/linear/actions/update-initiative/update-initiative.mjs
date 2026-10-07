import updateInitiative from "@pipedream/linear_app/actions/update-initiative/update-initiative.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */
/* eslint-disable pipedream/required-properties-version */

export default {
  ...updateInitiative,
  ...utils.getAppProps(updateInitiative),
  key: "linear-update-initiative",
  description: "Update an existing initiative in Linear. All fields are optional; only provided fields are updated. Use **List Initiatives** to find the initiative ID. Example: `initiativeId: \"b2c3d4e5-0000-0000-0000-000000000002\"`, `status: \"Completed\"` → returns `{success: true, initiative: {id: \"b2c3d4e5-...\", name: \"Q4 Platform Upgrade\", status: \"Completed\"}}`. [See the documentation](https://studio.apollographql.com/public/Linear-API/variant/current/schema/reference/objects/Mutation?query=initiativeupdate)",
  version: "0.0.3",
  ai: "optimized",
};
