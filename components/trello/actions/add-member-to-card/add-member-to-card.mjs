import validate from "validate.js";
import common from "../common.js";

export default {
  ...common,
  key: "trello-add-member-to-card",
  name: "Add Member to Card",
  description: "Adds a member to the specified card.",
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
      description: "The ID of the Card to add the Member to",
      optional: false,
    },
    idMember: {
      propDefinition: [
        common.props.trello,
        "member",
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
      idMember: {
        presence: true,
        format: {
          pattern: "^[0-9a-fA-F]{24}$",
          message: function (value) {
            return validate.format("^%{id} is not a valid Member id", {
              id: value,
            });
          },
        },
      },
    };
    const validationResult = validate(
      {
        idCard: this.idCard,
        idMember: this.idMember,
      },
      constraints,
    );
    this.checkValidationResults(validationResult);
    const res = await this.trello.addMemberToCard(this.idCard, {
      value: this.idMember,
    }, $);
    $.export("$summary", `Successfully added member ${res[0].fullName} to card ${this.idCard}`);
    return res;
  },
};
