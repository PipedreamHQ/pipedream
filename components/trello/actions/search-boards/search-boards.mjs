import common from "../common.mjs";

export default {
  ...common,
  key: "trello-search-boards",
  name: "Search Boards",
  description: "Searches for boards matching the specified query. [See the documentation](https://developer.atlassian.com/cloud/trello/rest/api-group-search/#api-search-get).",
  version: "0.3.0",
  type: "action",
  props: {
    ...common.props,
    query: {
      propDefinition: [
        common.props.app,
        "query",
      ],
    },
    idOrganizations: {
      propDefinition: [
        common.props.app,
        "idOrganizations",
      ],
      description: "Specify the organizations to search for boards in",
    },
    partial: {
      propDefinition: [
        common.props.app,
        "partial",
      ],
    },
    boardFields: {
      propDefinition: [
        common.props.app,
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
    const { boards } = await this.app.search({
      $,
      params: {
        query: this.query,
        idOrganizations: this.idOrganizations?.join(","),
        modelTypes: "boards",
        board_fields: this.boardFields.join(","),
        boards_limit: this.boardsLimit,
        partial: this.partial,
      },
    });
    $.export("$summary", `Successfully retrieved ${boards.length} board(s)`);
    return boards;
  },
};
