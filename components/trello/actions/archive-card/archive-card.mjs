import validate from "validate.js";
import common from "../common.js";

export default {
  ...common,
  key: "trello-archive-card",
  name: "Archive Card",
  description: "Archives a card.",
  version: "0.1.2",
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
      description: "The ID of the Card to archive",
      optional: false,
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
    };
    const validationResult = validate(
      {
        idCard: this.idCard,
      },
      constraints,
    );
    this.checkValidationResults(validationResult);
    const res = await this.trello.archiveCard(this.idCard, $);
    $.export("$summary", `Successfully archived card ${this.idCard}`);
    return res;
  },
};
