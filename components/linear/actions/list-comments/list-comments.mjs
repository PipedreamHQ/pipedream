import listComments from "@pipedream/linear_app/actions/list-comments/list-comments.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */
/* eslint-disable pipedream/required-properties-version */

export default {
  ...listComments,
  ...utils.getAppProps(listComments),
  key: "linear-list-comments",
  description: "List comments in Linear. [See the documentation](https://studio.apollographql.com/public/Linear-API/variant/current/schema/reference/objects/Query?query=comments).",
  version: "0.0.1",
};
