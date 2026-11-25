import listInitiatives from "@pipedream/linear_app/actions/list-initiatives/list-initiatives.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */
/* eslint-disable pipedream/required-properties-version */

export default {
  ...listInitiatives,
  ...utils.getAppProps(listInitiatives),
  key: "linear-list-initiatives",
  description: "List initiatives in Linear, optionally filtered by name or status. Use this to discover valid initiative IDs for creating updates or linking projects. Returns initiative objects with `id`, `name`, `status`, and `targetDate`. Example: `status: \"Active\"` → returns `{nodes: [{id: \"ini_01abc\", name: \"Q4 Platform Upgrade\", status: \"Active\"}], pageInfo: {endCursor: \"...\", hasNextPage: false}}`. [See the documentation](https://studio.apollographql.com/public/Linear-API/variant/current/schema/reference/objects/Query?query=initiatives)",
  version: "0.0.3",
  ai: "optimized",
};
