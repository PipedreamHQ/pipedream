import component from "../../../slack/actions/join-channel/join-channel.mjs";
import constants from "../../common/constants.mjs";
import utils from "../../common/utils.mjs";

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
              constants.CHANNEL_TYPE.MPIM,
            ],
            channelsFilter: (channel) => !channel.is_member,
          }),
        ],
      },
    },
  }),
  key: "slack_bot-join-channel",
  description: "Join an existing channel (Bot). [See docs here](https://api.slack.com/methods/conversations.join)",
  version: "0.0.1",
};
