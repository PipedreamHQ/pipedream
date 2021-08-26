const {
  props,
  methods,
} = require("../common");
const validate = require("validate.js");

module.exports = {
  key: "trello-search-boards",
  name: "Search Boards",
  description: "Searches for boards matching the specified query.",
  version: "0.0.13",
  type: "action",
  props: {
    ...props,
    query: {
      propDefinition: [
        props.trello,
        "query",
      ],
    },
    idBoards: {
      propDefinition: [
        props.trello,
        "idBoards",
      ],
    },
    idOrganizations: {
      propDefinition: [
        props.trello,
        "idOrganizations",
      ],
      description: "An string array of Organizations IDs where boards will be searched in.",
    },
    partial: {
      propDefinition: [
        props.trello,
        "partial",
      ],
    },
    boardFields: {
      type: "string",
      label: "Boards Fields",
      description: "`all` or a comma-separated list of: `closed`, `dateLastActivity`, `dateLastView`, `desc`, `descData`, `idOrganization`, `invitations`, `invited`, `labelNames`, `memberships`, `name`, `pinned`, `powerUps`, `prefs`, `shortLink`, `shortUrl`, `starred`, `subscribed`, `url`.",
      default: "name, idOrganization",
    },
    boardsLimit: {
      type: "integer",
      label: "Boards Limit",
      description: "The maximum number of boards to return.",
      default: 10,
    },
  },
  methods: {
    ...methods,
  },
  async run() {
    const constraints = {
      query: {
        presence: true,
        length: {
          minimum: 1,
          maximum: 16384,
        },
      },
      boardsLimit: {
        type: "integer",
        numericality: {
          greaterThanOrEqualTo: 1,
          lessThanOrEqualTo: 1000,
          message: "must be a positive integer greater than or equal to 1, and less than or equal to 1000.",
        },
      },
    };
    if (this.idOrganizations) {
      constraints.idOrganizations = {
        type: "array",
      };
    }
    const validationResult = validate({
      query: this.query,
      boardsLimit: this.boardsLimit,
      idOrganizations: this.idOrganizations,
    }, constraints);
    this.checkValidationResults(validationResult);
    const opts = {
      query: this.query,
      idBoards: this.idBoards,
      idOrganizations: this.idOrganizations,
      modelTypes: "boards",
      board_fields: this.boardFields,
      boards_limit: this.boardsLimit,
      partial: this.partial,
    };
    return await this.trello.searchBoards(opts);
  },
};
