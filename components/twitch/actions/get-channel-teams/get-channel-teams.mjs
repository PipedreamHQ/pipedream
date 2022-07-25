import common from "../common.mjs";

export default {
  ...common,
  name: "Get Channel Teams",
  key: "twitch-get-channel-teams",
  description: "Gets a list of teams to which a specified channel belongs",
  version: "0.0.2",
  type: "action",
  props: {
    ...common.props,
    broadcaster: {
      propDefinition: [
        common.props.twitch,
        "broadcaster",
      ],
      description: "The broadcaster ID of the channel to get teams for",
    },
  },
  async run() {
    const params = {
      broadcaster_id: this.broadcaster,
    };
    return (await this.twitch.getChannelTeams(params)).data.data;
  },
};
