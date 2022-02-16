import validate from "validate.js";
import common from "../common.js";

export default {
  ...common,
  key: "trello-add-existing-label-to-card",
  name: "Add Existing Label to Card",
  description: "Adds an existing label to the specified card.",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    idCard: {
      type: "string",
      label: "Id Card",
      description: "The ID of the Card to add the Label on.",
    },
    idLabel: {
      type: "string",
      label: "Id Label",
      description: "The ID of the Label to be added to the card.",
    },
  },
  async run({ $ }) {
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
    return this.trello.addExistingLabelToCard(this.idCard, {
      value: this.idLabel,
    }, $);
  },
};
