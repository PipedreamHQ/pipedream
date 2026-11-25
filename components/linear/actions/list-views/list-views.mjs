import listViews from "@pipedream/linear_app/actions/list-views/list-views.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */
/* eslint-disable pipedream/required-properties-version */

export default {
  ...listViews,
  ...utils.getAppProps(listViews),
  key: "linear-list-views",
  description: "List saved custom views in Linear. Use this to discover valid view IDs for the **Get View Issues** action. Custom views combine filters (team, assignee, state, labels, etc.) into a reusable saved search. Optionally filter by team. Example: `teamId: \"9d1c3f7e-...\"` → returns `{nodes: [{id: \"cv1abc\", name: \"My Open Issues\", teamId: \"9d1c3f7e-...\"}], pageInfo: {endCursor: \"...\", hasNextPage: false}}`. [See the documentation](https://studio.apollographql.com/public/Linear-API/variant/current/schema/reference/objects/Query?query=customViews)",
  version: "0.0.3",
  ai: "optimized",
};
