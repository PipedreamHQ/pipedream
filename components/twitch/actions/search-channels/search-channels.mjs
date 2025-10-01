import common from "../common.mjs";

export default {
  ...common,
  name: "Search Channels",
  key: "twitch-search-channels",
  description: `Returns a list of channels (users who have streamed within the past 6 months)
    that match the query via channel name or description either entirely or partially. Results
    include both live and offline channels.`,
  version: "0.1.3",
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
      description: "Maximum number of channels to return",
    },
    query: {
      type: "string",
      label: "Query",
      description: "The search query",
    },
    liveOnly: {
      type: "boolean",
      label: "Live Only",
      description: "Filter results for live streams only",
      default: false,
    },
  },
  async run() {
    const params = {
      query: this.query,
      live_only: this.liveOnly,
    };
    const searchResults = await this.paginate(
      this.twitch.searchChannels.bind(this),
      params,
      this.max,
    );
    return await this.getPaginatedResults(searchResults);
  },
};
