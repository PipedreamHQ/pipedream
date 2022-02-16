import validate from "validate.js";
import common from "../common.js";

export default {
  ...common,
  key: "trello-search-cards",
  name: "Search Cards",
  description: "Searches for cards matching the specified query.",
  version: "0.1.2",
  type: "action",
  props: {
    ...common.props,
    query: {
      propDefinition: [
        common.props.trello,
        "query",
      ],
    },
    idBoards: {
      propDefinition: [
        common.props.trello,
        "idBoards",
      ],
    },
    idOrganizations: {
      propDefinition: [
        common.props.trello,
        "idOrganizations",
      ],
    },
    partial: {
      propDefinition: [
        common.props.trello,
        "partial",
      ],
    },
    idCards: {
      type: "string[]",
      label: "Id Cards",
      description: "An string array of Cards IDs. Search will be done on these cards.",
      optional: true,
    },
    cardFields: {
      propDefinition: [
        common.props.trello,
        "cardFields",
      ],
    },
    cardsLimit: {
      type: "integer",
      label: "Cards Limit",
      description: "The maximum number of cards to return.",
      default: 10,
    },
    cardsPage: {
      type: "integer",
      label: "Card Page",
      description: "The page of results for cards.",
      default: 0,
    },
    cardBoard: {
      type: "boolean",
      label: "Include Card Board?",
      description: "Flag for including of parent board with card results.",
      default: false,
    },
    cardList: {
      type: "boolean",
      label: "Include Card List?",
      description: "Flag for including the parent list with card results.",
      default: false,
    },
    cardMembers: {
      type: "boolean",
      label: "Include Card Members?",
      description: "Flag for including member objects with card results.",
      default: false,
    },
    cardStickers: {
      type: "boolean",
      label: "Include Card Stickers?",
      description: "flag for including sticker objects with card results.",
      default: false,
    },
    cardAttachments: {
      type: "string",
      label: "Include Card Attachments?",
      description: "flag for including attachment objects with card results. a boolean value (`true` or `false`) or `cover` for only card cover attachment.",
      default: "false",
    },
  },
  async run({ $ }) {
    const constraints = {
      query: {
        presence: true,
        length: {
          minimum: 1,
          maximum: 16384,
        },
      },
      cardsLimit: {
        type: "integer",
        numericality: {
          greaterThanOrEqualTo: 1,
          lessThanOrEqualTo: 1000,
          message: "must be a positive integer greater than or equal to 1, and less than or equal to 1000.",
        },
      },
      cardsPage: {
        type: "integer",
        numericality: {
          greaterThanOrEqualTo: 0,
          lessThanOrEqualTo: 100,
          message: "must be a positive integer greater than or equal to 1, and less than or equal to 100.",
        },
      },
    };
    if (this.idCards) {
      constraints.idCards = {
        type: "array",
      };
    }
    if (this.idOrganizations) {
      constraints.idOrganizations = {
        type: "array",
      };
    }
    const validationResult = validate({
      query: this.query,
      cardsLimit: this.cardsLimit,
      cardsPage: this.cardsPage,
      idCards: this.idCards,
      idOrganizations: this.idOrganizations,
    }, constraints);
    this.checkValidationResults(validationResult);
    const opts = {
      query: this.query,
      idBoards: this.idBoards,
      idOrganizations: this.idOrganizations,
      idCards: this.idCards,
      modelTypes: "cards",
      card_fields: this.cardFields,
      cards_limit: this.cardsLimit,
      cards_page: this.cardsPage,
      card_board: this.cardBoard,
      card_list: this.cardList,
      card_members: this.cardMembers,
      card_stickers: this.cardStickers,
      card_attachments: this.cardAttachments,
      partial: this.partial,
    };
    return this.trello.searchCards(opts, $);
  },
};
