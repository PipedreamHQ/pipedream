import listInitiatives from "@pipedream/linear_app/actions/list-initiatives/list-initiatives.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */
/* eslint-disable pipedream/required-properties-version */

export default {
  ...listInitiatives,
  ...utils.getAppProps(listInitiatives),
  key: "linear-list-initiatives",
  description: "List initiatives in Linear. **Response size matters here:** by default every field of every initiative is returned, including the full markdown `content` body, which makes the response grow with how much people have written rather than how many initiatives there are. `fields: \"compact\"` returns `id,name,description,status,targetDate`, which is what a question about initiatives normally needs. [See the documentation](https://studio.apollographql.com/public/Linear-API/variant/current/schema/reference/objects/Query?query=initiatives)",
  version: "0.1.0",
};
