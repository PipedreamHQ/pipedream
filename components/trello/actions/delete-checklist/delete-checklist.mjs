import validate from "validate.js";
import common from "../common.js";

export default {
  ...common,
  key: "trello-delete-checklist",
  name: "Delete Checklist",
  description: "Deletes the specified checklist.",
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
      description: "The ID of the card containing the checklist do delete",
      optional: false,
    },
    idChecklist: {
      propDefinition: [
        common.props.trello,
        "checklist",
        (c) => ({
          card: c.idCard,
        }),
      ],
      description: "The ID of the checklist to delete",
    },
  },
  async run({ $ }) {
    const constraints = {
      idChecklist: {
        presence: true,
        format: {
          pattern: "^[0-9a-fA-F]{24}$",
          message: function (value) {
            return validate.format("^%{id} is not a valid Checklist id", {
              id: value,
            });
          },
        },
      },
    };
    const validationResult = validate({
      idChecklist: this.idChecklist,
    },
    constraints);
    this.checkValidationResults(validationResult);
    await this.trello.deleteChecklist(this.idChecklist, $);
    $.export("$summary", `Successfully deleted checklist ${this.idChecklist}`);
  },
};
