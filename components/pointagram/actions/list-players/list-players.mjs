import app from "../../pointagram.app.mjs";
import options from "../../options.mjs";

export default {
  type: "action",
  key: "pointagram-list-players",
  name: "List Players",
  description: "List all players. [See the docs here](https://www.pointagram.com/custom-integration-gamification/)",
  version: "0.1.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    searchBy: {
      type: "string",
      label: "Search By",
      description: "The field to search by",
      options: options.LIST_PLAYERS_SEARCH_BY,
      optional: true,
    },
    searchValue: {
      type: "string",
      label: "Search Value",
      description: "The value to search by",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      searchValue,
      searchBy,
    } = this;
    const res = await this.app.listPlayers({
      search_by: searchBy,
      filter: searchValue,
    }, $);
    $.export("$summary", "Players successfully listed");
    return res;
  },
};
