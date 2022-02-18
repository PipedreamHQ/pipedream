import validate from "validate.js";
import common from "../common.js";

export default {
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
      description: "Unique identifier of the board to search for lists",
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
    const {
      board,
      name,
      cardFilter,
      cardFields,
      listFilter,
    } = this;
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
      board,
      name,
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
