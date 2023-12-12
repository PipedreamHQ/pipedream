import common from "../common.mjs";

export default {
  ...common,
  key: "trello-search-boards",
  name: "Search Boards",
  description: "Searches for boards matching the specified query. [See the docs here](https://developer.atlassian.com/cloud/trello/rest/api-group-search/#api-search-get)",
  version: "0.2.3",
  type: "action",
  props: {
    ...common.props,
    query: {
      propDefinition: [
        common.props.trello,
        "query",
      ],
    },
    idOrganizations: {
      propDefinition: [
        common.props.trello,
        "idOrganizations",
      ],
      description: "Specify the organizations to search for boards in",
    },
    partial: {
      propDefinition: [
        common.props.trello,
        "partial",
      ],
    },
    boardFields: {
      propDefinition: [
        common.props.trello,
        "boardFields",
      ],
    },
    boardsLimit: {
      type: "integer",
      label: "Boards Limit",
      description: "The maximum number of boards to return.",
      default: 10,
    },
  },
  async run({ $ }) {
    const opts = {
      query: this.query,
      idOrganizations: this.idOrganizations,
      modelTypes: "boards",
      board_fields: this.boardFields.join(","),
      boards_limit: this.boardsLimit,
      partial: this.partial,
    };
    const { boards } = await this.trello.searchBoards(opts, $);
    $.export("$summary", `Successfully retrieved ${boards.length} board(s)`);
    return boards;
  },
};
