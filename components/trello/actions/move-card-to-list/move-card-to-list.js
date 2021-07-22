const trello = require("../../trello.app");
const validate = require("validate.js");
const common = require("../common");

module.exports = {
  key: "trello-move-card-to-list",
  name: "Move Card to List",
  description: "Enter action description here.",
  version: "0.0.6",
  type: "action",
  props: {
    trello,
    cardId: {
      type: "string",
      label: "Card Id",
      description:
        "The ID of the Card to move.",
    },
    toBoardId: {
      type: "string",
      label: "From Board Id",
      description:
            "The ID of the board the card should be moved to.",
    },
    toListId: {
      type: "string",
      label: "From List Id",
      description:
          "The ID of the list that the card should be moved to.",
    },
  },
  methods: {
    ...common,
  },
  async run() {
    const constraints = {
      cardId: {
        presence: true,
      },
      toBoardId: {
        presence: true,
      },
      toListId: {
        presence: true,
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
    return await this.trello.moveCardToList(this.cardId,
      {
        toBoardId: this.toBoardId,
        toListId: this.toListId,
      });
  },
};
