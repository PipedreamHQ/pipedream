import component from "../../../slack/actions/archive-channel/archive-channel.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */

export default {
  ...component,
  props: utils.buildAppProps({
    component,
  }),
  key: "slack_bot-archive-channel",
  description: "Archive a channel (Bot). [See docs here](https://api.slack.com/methods/conversations.archive)",
  version: "0.0.1",
};
