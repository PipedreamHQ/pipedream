import createInitiative from "@pipedream/linear_app/actions/create-initiative/create-initiative.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */
/* eslint-disable pipedream/required-properties-version */

export default {
  ...createInitiative,
  ...utils.getAppProps(createInitiative),
  key: "linear-create-initiative",
  description: "Create a new initiative in Linear to track a cross-team strategic goal. Initiatives group multiple projects toward a shared objective. Use **List Users** to find a valid owner ID. Example: `initiativeName: \"Q4 Platform Upgrade\"`, `status: \"Active\"`, `targetDate: \"2024-12-31\"` → returns `{success: true, initiative: {id: \"ini_01abc\", name: \"Q4 Platform Upgrade\"}}`. [See the documentation](https://studio.apollographql.com/public/Linear-API/variant/current/schema/reference/objects/Mutation?query=initiativeCreate)",
  version: "0.0.3",
  ai: "optimized",
};
