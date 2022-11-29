import component from "../../../slack/actions/list-replies/list-replies.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */

export default {
  ...component,
  props: utils.buildAppProps({
    component,
  }),
  key: "slack_bot-list-replies",
  description: "Retrieve a thread of messages posted to a conversation (Bot). [See docs here](https://api.slack.com/methods/conversations.replies)",
  version: "0.0.1",
};
