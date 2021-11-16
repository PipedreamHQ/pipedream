const validate = require("validate.js");
const common = require("../common");

module.exports = {
  ...common,
  key: "trello-get-a-card",
  name: "Get a Card",
  description: "Gets a card by its ID.",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    cardId: {
      type: "string",
      label: "Card Id",
      description: "The ID of the card to get details of.",
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
    };
    const validationResult = validate({
      cardId: this.cardId,
    },
    constraints);
    this.checkValidationResults(validationResult);
    return await this.trello.getCard(this.cardId);
  },
};
