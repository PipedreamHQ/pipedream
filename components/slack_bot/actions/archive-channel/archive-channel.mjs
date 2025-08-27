import component from "@pipedream/slack/actions/archive-channel/archive-channel.mjs";
import constants from "../../common/constants.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */

export default {
  ...component,
  props: utils.buildAppProps({
    component,
    addedProps: {
      conversation: {
        propDefinition: [
          undefined,
          "conversation",
          () => ({
            types: [
              constants.CHANNEL_TYPE.PUBLIC,
              constants.CHANNEL_TYPE.PRIVATE,
              constants.CHANNEL_TYPE.MPIM,
            ],
          }),
        ],
      },
    },
  }),
  key: "slack_bot-archive-channel",
  description: "Archive a channel (Bot). [See the documentation](https://api.slack.com/methods/conversations.archive)",
  version: "0.0.5",
};
