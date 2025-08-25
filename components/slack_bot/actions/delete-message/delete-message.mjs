import component from "@pipedream/slack/actions/delete-message/delete-message.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */

export default {
  ...component,
  props: utils.buildAppProps({
    component,
    omitProps: [
      "as_user",
    ],
  }),
  key: "slack_bot-delete-message",
  description: "Delete a message (Bot). [See the documentation](https://api.slack.com/methods/chat.delete)",
  version: "0.0.5",
};
