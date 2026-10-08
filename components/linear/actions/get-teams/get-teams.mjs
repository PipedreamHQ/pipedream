import getTeams from "@pipedream/linear_app/actions/get-teams/get-teams.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */
/* eslint-disable pipedream/required-properties-version */

export default {
  ...getTeams,
  ...utils.getAppProps(getTeams),
  key: "linear-get-teams",
  description: "Retrieves teams in your Linear workspace. Returns team objects with `id`, `name`, `key`, and more (including internal settings fields). Use this to discover valid team IDs (UUIDs) for creating or filtering issues and projects. Supports pagination: pass `after` with the previous response's `pageInfo.endCursor` to load the next page. Use the optional `fields` prop to narrow the response to only the keys you need (reduces context for large result sets). Example: call with `limit: 50` → returns `{nodes: [{id: \"9d1c3f7e-...\", name: \"Engineering\", key: \"ENG\"}, ...], pageInfo: {endCursor: \"...\", hasNextPage: true}}`. [See the documentation](https://studio.apollographql.com/public/Linear-API/variant/current/schema/reference/objects/Query?query=teams).",
  version: "0.2.18",
  ai: "optimized",
};
