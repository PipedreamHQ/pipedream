const validate = require("validate.js");
const common = require("../common");

module.exports = {
  ...common,
  key: "trello-add-remove-label-from-card",
  name: "Remove a Label from a Card",
  description: "Removes an existing label from the specified card.",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    idCard: {
      type: "string",
      label: "Id Card",
      description: "The ID of the Card to remove the Label from.",
    },
    idLabel: {
      type: "string",
      label: "Id Label",
      description: "The ID of the Label to be removed from the card.",
    },
  },
  methods: {
    ...common.methods,
  },
  async run() {
    const constraints = {
      idCard: {
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
      idLabel: {
        presence: true,
        format: {
          pattern: "^[0-9a-fA-F]{24}$",
          message: function (value) {
            return validate.format("^%{id} is not a valid Label id", {
              id: value,
            });
          },
        },
      },
    };
    const validationResult = validate(
      {
        idCard: this.idCard,
        idLabel: this.idLabel,
      },
      constraints,
    );
    this.checkValidationResults(validationResult);
    return await this.trello.removeLabelFromCard(this.idCard,
      this.idLabel);
  },
};
