import listViews from "@pipedream/linear_app/actions/list-views/list-views.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */
/* eslint-disable pipedream/required-properties-version */

export default {
  ...listViews,
  ...utils.getAppProps(listViews),
  key: "linear-list-views",
  description: "List views in Linear. [See the documentation](https://studio.apollographql.com/public/Linear-API/variant/current/schema/reference/objects/Query?query=views).",
  version: "0.0.1",
};
