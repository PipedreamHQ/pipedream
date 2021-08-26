const {
  props,
  methods,
} = require("../common");
const validate = require("validate.js");

module.exports = {
  key: "trello-find-a-list",
  name: "Find a List",
  description: "Finds a list on a specific board by name.",
  version: "0.0.15",
  type: "action",
  props: {
    ...props,
    board: {
      propDefinition: [
        props.trello,
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
        props.trello,
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
  methods: {
    ...methods,
  },
  async run() {
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
    validate.validators.posStringValiadator = function (option) {
      return self.trello.getFilterOptions().includes(option) ?
        null :
        filterOptsValidationMesssage;
    };
    if (this.cardFilter) {
      constraints.cardFilter = {
        posStringValiadator: this.cardFilter,
      };
    }
    if (this.listFilter) {
      constraints.listFilter = {
        posStringValiadator: this.listFilter,
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
    const lists = await this.trello.findList(this.board, opts);
    return this.getMatches(lists, this.name);
  },
};
