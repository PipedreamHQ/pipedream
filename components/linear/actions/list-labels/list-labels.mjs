import listLabels from "@pipedream/linear_app/actions/list-labels/list-labels.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */
/* eslint-disable pipedream/required-properties-version */

export default {
  ...listLabels,
  ...utils.getAppProps(listLabels),
  key: "linear-list-labels",
  description: "List issue labels in the Linear workspace. Use this to discover valid label names and IDs for creating or filtering issues. Returns label objects with `id`, `name`, and `color`. Example: `first: 50` → returns `{nodes: [{id: \"lbl_bug123\", name: \"Bug\", color: \"#ef4444\"}, {id: \"lbl_fe456\", name: \"Frontend\", color: \"#0ea5e9\"}], pageInfo: {endCursor: \"...\", hasNextPage: false}}`. [See the documentation](https://studio.apollographql.com/public/Linear-API/variant/current/schema/reference/objects/Query?query=issueLabels).",
  version: "0.0.2",
  ai: "optimized",
};
