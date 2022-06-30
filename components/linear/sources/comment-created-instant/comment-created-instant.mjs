import common from "../common/webhook-props.mjs";
import commentCreatedInstant from "../../../linear_app/sources/comment-created-instant/comment-created-instant.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */
/* eslint-disable pipedream/required-properties-version */

export default {
  ...commentCreatedInstant,
  key: "linear-comment-created-instant",
  description: "Emit new event when a new comment is created (OAuth). See the docs [here](https://developers.linear.app/docs/graphql/webhooks)",
  props: {
    ...common.props,
  },
};
