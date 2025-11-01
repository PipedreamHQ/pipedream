import common from "../common.mjs";

export default {
  ...common,
  name: "Search Games",
  key: "twitch-search-games",
  description: `Searches for games based on a specified query parameter. A game is
    returned if the query parameter is matched entirely or partially in the channel
    description or game name`,
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
    query: {
      type: "string",
      label: "Query",
      description: "The search query",
    },
  },
  async run() {
    const params = {
      query: this.query,
    };
    const searchResults = await this.paginate(
      this.twitch.searchGames.bind(this),
      params,
      this.max,
    );
    return await this.getPaginatedResults(searchResults);
  },
};
