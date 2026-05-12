import createComment from "@pipedream/linear_app/actions/create-comment/create-comment.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */
/* eslint-disable pipedream/required-properties-version */

export default {
  ...createComment,
  ...utils.getAppProps(createComment),
  key: "linear-create-comment",
  description: "Create a comment in Linear. [See the documentation](https://studio.apollographql.com/public/Linear-API/variant/current/schema/reference/objects/Mutation?query=comment)",
  version: "0.0.1",
};
