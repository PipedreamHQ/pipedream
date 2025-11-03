import commentCreatedInstant from "@pipedream/linear_app/sources/comment-created-instant/comment-created-instant.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */
/* eslint-disable pipedream/required-properties-version */

export default {
  ...commentCreatedInstant,
  ...utils.getAppProps(commentCreatedInstant),
  key: "linear-comment-created-instant",
  description: "Triggers instantly when a new comment is added to an issue in Linear. Returns comment details including content, author, issue reference, and timestamps. Supports filtering by team. Uses OAuth authentication. See Linear docs for additional info [here](https://linear.app/developers/webhooks).",
  version: "0.1.15",
};
