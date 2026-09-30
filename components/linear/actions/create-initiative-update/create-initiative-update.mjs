import createInitiativeUpdate from "@pipedream/linear_app/actions/create-initiative-update/create-initiative-update.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */
/* eslint-disable pipedream/required-properties-version */

export default {
  ...createInitiativeUpdate,
  ...utils.getAppProps(createInitiativeUpdate),
  key: "linear-create-initiative-update",
  description: "Post a status update on a Linear initiative. Use **List Initiatives** first to obtain the initiative ID. Updates appear in the initiative's activity feed and can include a health status. Example: `initiativeId: \"b2c3d4e5-0000-0000-0000-000000000002\"`, `body: \"Two projects completed; on track for Q4.\"`, `health: \"onTrack\"` → returns `{success: true, initiativeUpdate: {id: \"iu_01xyz\"}}`. [See the documentation](https://studio.apollographql.com/public/Linear-API/variant/current/schema/reference/objects/Mutation?query=initiativeUpdateCreate).",
  version: "0.0.2",
  ai: "optimized",
};
