import validate from "validate.js";
import common from "../common.js";

export default {
  ...common,
  key: "trello-find-list",
  name: "Find a List",
  description: "Finds a list on a specific board by name. [See the docs here](https://developer.atlassian.com/cloud/trello/rest/api-group-boards/#api-boards-id-lists-get)",
  version: "0.1.2",
  type: "action",
  props: {
    ...common.props,
    board: {
      propDefinition: [
        common.props.trello,
        "board",
      ],
      description: "Unique identifier of the board to search for lists",
    },
    name: {
      propDefinition: [
        common.props.trello,
        "name",
      ],
      label: "List Name",
      description: "Name of the list to find.",
      optional: false,
    },
    cardFilter: {
      propDefinition: [
        common.props.trello,
        "cardFilter",
      ],
    },
    cardFields: {
      propDefinition: [
        common.props.trello,
        "cardFields",
      ],
    },
    listFilter: {
      propDefinition: [
        common.props.trello,
        "listFilter",
      ],
    },
  },
  async run({ $ }) {
    const {
      board,
      name,
      cardFilter,
      cardFields,
      listFilter,
    } = this;
    const constraints = {};
    const self = this;
    const filterOptsValidationMesssage = "must be one of `all`, `closed`, `none`, or `open`";
    validate.validators.filterOptsValidator = function (option) {
      return self.trello.getFilterOptions().includes(option) ?
        null :
        filterOptsValidationMesssage;
    };
    if (cardFilter) {
      constraints.cardFilter = {
        filterOptsValidator: cardFilter,
      };
    }
    if (listFilter) {
      constraints.listFilter = {
        filterOptsValidator: listFilter,
      };
    }
    const validationResult = validate({
      cardFilter,
      listFilter,
    }, constraints);
    this.checkValidationResults(validationResult);
    const opts = {
      cards: cardFilter,
      card_fields: cardFields,
      filter: listFilter,
    };
    const lists = await this.trello.findList(this.board, opts, $);
    const res = this.getMatches(lists, this.name);
    $.export("$summary", `Successfully retrieved lists with name ${this.name}`);
    return res;
  },
};
