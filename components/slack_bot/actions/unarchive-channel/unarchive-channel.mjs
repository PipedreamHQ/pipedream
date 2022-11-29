import component from "../../../slack/actions/unarchive-channel/unarchive-channel.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */

export default {
  ...component,
  props: utils.buildAppProps({
    component,
  }),
  key: "slack_bot-unarchive-channel",
  description: "Unarchive a channel (Bot). [See docs here](https://api.slack.com/methods/conversations.unarchive)",
  version: "0.0.1",
};
