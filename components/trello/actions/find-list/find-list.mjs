import validate from "validate.js";
import common from "../common.js";

module.exports = {
  ...common,
  key: "trello-find-list",
  name: "Find a List",
  description: "Finds a list on a specific board by name.",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    board: {
      propDefinition: [
        common.props.trello,
        "board",
      ],
      label: "Id Board",
      description: "Unique identifier of the board to search for lists. Must match pattern `^[0-9a-fA-F]{24}$`.",
    },
    name: {
      type: "string",
      label: "List Name",
      description: "Name of the list to find.",
    },
    cardFilter: {
      type: "string",
      label: "Card Filter",
      description: "Filter to apply to Cards. Valid values: `all`, `closed`, `none`, `open`.",
      options() {
        return this.trello.getFilterOptions();
      },
      default: "all",
    },
    cardFields: {
      propDefinition: [
        common.props.trello,
        "cardFields",
      ],
    },
    listFilter: {
      type: "string",
      label: "List Filter",
      description: "Filter to apply to Lists. Valid values: `all`, `closed`, `none`, `open`.",
      options() {
        return this.trello.getFilterOptions();
      },
      default: "all",
    },
  },
  async run({ $ }) {
    const constraints = {
      board: {
        presence: true,
        format: {
          pattern: "^[0-9a-fA-F]{24}$",
          message: function (value) {
            return validate.format("^%{id} is not a valid Board id", {
              id: value,
            });
          },
        },
      },
      name: {
        presence: true,
      },
    };
    const self = this;
    const filterOptsValidationMesssage = "must be one of `all`, `closed`, `none`, or `open`";
    validate.validators.filterOptsValidator = function (option) {
      return self.trello.getFilterOptions().includes(option) ?
        null :
        filterOptsValidationMesssage;
    };
    if (this.cardFilter) {
      constraints.cardFilter = {
        filterOptsValidator: this.cardFilter,
      };
    }
    if (this.listFilter) {
      constraints.listFilter = {
        filterOptsValidator: this.listFilter,
      };
    }
    const validationResult = validate({
      board: this.board,
      name: this.name,
      cardFilter: this.cardFilter,
      listFilter: this.listFilter,
    }, constraints);
    this.checkValidationResults(validationResult);
    const opts = {
      cards: this.cardFilter,
      card_fields: this.cardFields,
      filter: this.listFilter,
    };
    const lists = await this.trello.findList(this.board, opts, $);
    return this.getMatches(lists, this.name);
  },
};
