import component from "@pipedream/slack/actions/list-channels/list-channels.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */

export default {
  ...component,
  props: utils.buildAppProps({
    component,
  }),
  key: "slack_bot-list-channels",
  description: "Return a list of all channels in a workspace (Bot). [See the documentation](https://api.slack.com/methods/conversations.list)",
  version: "0.0.5",
};
