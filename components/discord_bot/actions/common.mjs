import common from "../common.mjs";
import constants from "../constants.mjs";

const { discord } = common.props;

export default {
  ...common,
  props: {
    ...common.props,
    channelId: {
      propDefinition: [
        discord,
        "channelId",
        ({ guildId }) => ({
          guildId,
          notAllowedChannels: constants.NOT_ALLOWED_CHANNELS,
        }),
      ],
    },
  },
};
