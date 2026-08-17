import listViews from "@pipedream/linear_app/actions/list-views/list-views.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */
/* eslint-disable pipedream/required-properties-version */

export default {
  ...listViews,
  ...utils.getAppProps(listViews),
  key: "linear-list-views",
  description: "List views in Linear. **Response size matters here:** by default every field of every view is returned, including the serialized filter definitions (`filterData`, `projectFilterData`, `filters`) which are large nested blobs — measured at 26 KB average and 44 KB worst case on a real workspace, enough to exceed an AI agent's tool-output ceiling entirely. `fields: \"compact\"` returns `id,name,description,modelName`, which is what you need to pick a view and pass its id to **Get View Issues**. [See the documentation](https://studio.apollographql.com/public/Linear-API/variant/current/schema/reference/objects/Query?query=views)",
  version: "0.1.0",
};
