import common from "../common.mjs";

export default {
  ...common,
  name: "Get Top Games",
  key: "twitch-get-top-games",
  description: "Gets games sorted by number of current viewers on Twitch, most popular first",
  version: "0.1.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    ...common.props,
    max: {
      propDefinition: [
        common.props.twitch,
        "max",
      ],
      description: "Maximum number of games to return",
    },
  },
  async run() {
    const topGames = await this.paginate(
      this.twitch.getTopGames.bind(this),
      {},
      this.max,
    );
    return await this.getPaginatedResults(topGames);
  },
};
