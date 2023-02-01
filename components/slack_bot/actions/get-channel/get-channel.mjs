import component from "../../../slack/actions/get-channel/get-channel.mjs";
import utils from "../../common/utils.mjs";
import constants from "../../common/constants.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */

export default {
  ...component,
  props: utils.buildAppProps({
    component,
    omitProps: [
      "conversation",
    ],
    addedProps: {
      conversation: {
        propDefinition: [
          undefined,
          "channelId",
          () => ({
            types: [
              constants.CHANNEL_TYPE.PUBLIC,
              constants.CHANNEL_TYPE.PRIVATE,
              constants.CHANNEL_TYPE.MPIM,
              constants.CHANNEL_TYPE.IM,
            ],
          }),
        ],
      },
    },
  }),
  key: "slack_bot-get-channel",
  description: "Return information about a workspace channel (Bot). [See docs here](https://api.slack.com/methods/conversations.info)",
  version: "0.0.1",
};
