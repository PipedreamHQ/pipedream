const validate = require("validate.js");
const common = require("../common");

module.exports = {
  ...common,
  key: "trello-move-card-to-list",
  name: "Move Card to List",
  description: "Enter action description here.",
  version: "0.0.7",
  type: "action",
  props: {
    ...common.props,
    cardId: {
      type: "string",
      label: "Card Id",
      description: "The ID of the Card to move.",
    },
    toBoardId: {
      type: "string",
      label: "From Board Id",
      description: "The ID of the board the card should be moved to.",
    },
    toListId: {
      type: "string",
      label: "From List Id",
      description: "The ID of the list that the card should be moved to.",
    },
  },
  methods: {
    ...common.methods,
  },
  async run() {
    const constraints = {
      cardId: {
        presence: true,
        format: {
          pattern: "^[0-9a-fA-F]{24}$",
          message: function (value) {
            return validate.format("^%{id} is not a valid Card id", {
              id: value,
            });
          },
        },
      },
      toBoardId: {
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
      toListId: {
        presence: true,
        format: {
          pattern: "^[0-9a-fA-F]{24}$",
          message: function (value) {
            return validate.format("^%{id} is not a valid List id", {
              id: value,
            });
          },
        },
      },
    };
    const validationResult = validate(
      {
        cardId: this.cardId,
        toBoardId: this.toBoardId,
        toListId: this.toListId,
      },
      constraints,
    );
    this.checkValidationResults(validationResult);
    return await this.trello.moveCardToList(this.cardId, {
      toBoardId: this.toBoardId,
      toListId: this.toListId,
    });
  },
};
