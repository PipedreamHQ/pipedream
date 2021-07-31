const validate = require("validate.js");
const common = require("../common");

module.exports = {
  ...common,
  key: "trello-create-comment-on-card",
  name: "Create Comment on Card",
  description: "Creates a new comment on a card.",
  version: "0.0.4",
  type: "action",
  props: {
    ...common.props,
    idCard: {
      type: "string",
      label: "Id Card",
      description: "The ID of the card to create a new comment on. Must match pattern `^[0-9a-fA-F]{24}$`.",
    },
    comment: {
      type: "string",
      label: "Comment",
      description: "Text for the comment to be created.",
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
    return await this.trello.createCommentOnCard(this.idCard, this.comment);
  },
};
