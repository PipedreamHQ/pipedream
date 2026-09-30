import getInitiativeUpdate from "@pipedream/linear_app/actions/get-initiative-update/get-initiative-update.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */
/* eslint-disable pipedream/required-properties-version */

export default {
  ...getInitiativeUpdate,
  ...utils.getAppProps(getInitiativeUpdate),
  key: "linear-get-initiative-update",
  description: "Retrieve a single initiative update by its ID in Linear. Use **List Initiative Updates** first to obtain a valid update ID. Returns the full update including `id`, `body`, `health`, `createdAt`, and author. Example: `initiativeUpdateId: \"530f4366-88ab-4866-a44b-c2326728c32d\"` → returns `{id: \"530f4366-88ab-4866-a44b-c2326728c32d\", body: \"Two projects completed.\", health: \"onTrack\", createdAt: \"2024-01-15T10:00:00Z\"}`. [See the documentation](https://studio.apollographql.com/public/Linear-API/variant/current/schema/reference/objects/InitiativeUpdate?query=initiativeUpdate).",
  version: "0.0.2",
  ai: "optimized",
};
