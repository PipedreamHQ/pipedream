import commentCreatedInstant from "@pipedream/linear_app/sources/comment-created-instant/comment-created-instant.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */
/* eslint-disable pipedream/required-properties-version */

export default {
  ...commentCreatedInstant,
  ...utils.getAppProps(commentCreatedInstant),
  key: "linear-comment-created-instant",
  description: "Emit new event when a new comment is created (OAuth). [See the documentation](https://developers.linear.app/docs/graphql/webhooks)",
  version: "0.1.11",
};
