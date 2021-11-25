const common = require("../common.js");

module.exports = {
  ...common,
  name: "Get Channel Information",
  key: "twitch-get-channel-information",
  description: "Retrieves information about a particular broadcaster's channel",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    broadcaster: {
      propDefinition: [
        common.props.twitch,
        "broadcaster",
      ],
      description: "ID of the user/channel to get information about",
    },
  },
  async run() {
    const params = {
      broadcaster_id: this.broadcaster,
    };
    return (await this.twitch.getChannelInformation(params)).data.data;
  },
};
