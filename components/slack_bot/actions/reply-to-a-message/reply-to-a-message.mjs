import component from "../../../slack/actions/reply-to-a-message/reply-to-a-message.mjs";
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
  key: "slack_bot-reply-to-a-message",
  description: "Send a message as a threaded reply (Bot). See [postMessage](https://api.slack.com/methods/chat.postMessage) or [scheduleMessage](https://api.slack.com/methods/chat.scheduleMessage) docs here",
  version: "0.0.4",
};
