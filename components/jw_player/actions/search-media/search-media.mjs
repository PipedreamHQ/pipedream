import jw_player from "../../jw_player.app.mjs";

export default {
  key: "jw_player-search-media",
  name: "Search Media",
  description: "Searches for a media or lists all media available in JW Player. This action can be configured with optional props like 'searchQuery' for specific media search, and 'listAll' to display all media.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    jw_player,
    searchQuery: {
      propDefinition: [
        jw_player,
        "searchQuery",
      ],
    },
    listAll: {
      propDefinition: [
        jw_player,
        "listAll",
      ],
    },
  },
  async run({ $ }) {
    const searchParams = {};
    if (this.searchQuery) {
      searchParams.q = this.searchQuery;
    }
    if (this.listAll) {
      searchParams.page_length = 10000;
    }
    const response = await this.jw_player.listMedia(searchParams);
    $.export("$summary", `Found ${response.length} media items`);
    return response;
  },
};
