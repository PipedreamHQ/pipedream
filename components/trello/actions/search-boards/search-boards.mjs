import app from "../../trello.app.mjs";

export default {
  key: "trello-search-boards",
  name: "Search Boards",
  description: "Searches for boards matching the specified query. [See the documentation](https://developer.atlassian.com/cloud/trello/rest/api-group-search/#api-search-get).",
  version: "0.3.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    query: {
      propDefinition: [
        app,
        "query",
      ],
    },
    idOrganizations: {
      propDefinition: [
        app,
        "idOrganizations",
      ],
      description: "Specify the organizations to search for boards in",
    },
    partial: {
      propDefinition: [
        app,
        "partial",
      ],
      optional: true,
    },
    boardFields: {
      propDefinition: [
        app,
        "boardFields",
      ],
      optional: true,
    },
    boardsLimit: {
      type: "integer",
      label: "Boards Limit",
      description: "The maximum number of boards to return.",
      default: 10,
      optional: true,
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
