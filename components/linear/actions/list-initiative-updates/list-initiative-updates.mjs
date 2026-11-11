import listInitiativeUpdates from "@pipedream/linear_app/actions/list-initiative-updates/list-initiative-updates.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */
/* eslint-disable pipedream/required-properties-version */

export default {
  ...listInitiativeUpdates,
  ...utils.getAppProps(listInitiativeUpdates),
  key: "linear-list-initiative-updates",
  description: "List initiative updates in Linear, optionally scoped to a single initiative. Use **List Initiatives** to find an initiative ID. Returns update objects with `id`, `body`, `health`, `createdAt`, and author. Example: `initiativeId: \"b2c3d4e5-0000-0000-0000-000000000002\"`, `first: 10` → returns `{nodes: [{id: \"iu_01xyz\", body: \"Two projects completed.\", health: \"onTrack\"}], pageInfo: {endCursor: \"...\", hasNextPage: false}}`. [See the documentation](https://studio.apollographql.com/public/Linear-API/variant/current/schema/reference/objects/InitiativeUpdateConnection?query=initiativeUpdates).",
  version: "0.0.1",
  ai: "optimized",
};
