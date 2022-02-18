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
    board: {
      propDefinition: [
        common.props.trello,
        "board",
      ],
    },
    idCard: {
      propDefinition: [
        common.props.trello,
        "cards",
        (c) => ({
          board: c.board,
        }),
      ],
      type: "string",
      label: "Card",
      description: "The ID of the Card to add the Label to",
      optional: false,
    },
    idLabel: {
      propDefinition: [
        common.props.trello,
        "label",
        (c) => ({
          board: c.board,
        }),
      ],
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
    const res = await this.trello.addExistingLabelToCard(this.idCard, {
      value: this.idLabel,
    }, $);
    $.export("$summary", `Successfully added label ${this.idLabel} to card ${this.idCard}`);
    return res;
  },
};
