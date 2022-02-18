import validate from "validate.js";
import common from "../common.js";

export default {
  ...common,
  key: "trello-create-comment-on-card",
  name: "Create Comment on Card",
  description: "Creates a new comment on a card.",
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
      description: "The ID of the card to create a new comment on",
      optional: false,
    },
    comment: {
      type: "string",
      label: "Comment",
      description: "Text for the comment to be created.",
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
      comment: {
        presence: true,
      },
    };
    const validationResult = validate(
      {
        idCard: this.idCard,
        comment: this.comment,
      },
      constraints,
    );
    this.checkValidationResults(validationResult);
    const res = await this.trello.createCommentOnCard(this.idCard, this.comment, $);
    $.export("$summary", `Successfully added comment to card ${this.idCard}`);
    return res;
  },
};
