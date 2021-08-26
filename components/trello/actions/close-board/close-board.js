const validate = require("validate.js");
const common = require("../common");

module.exports = {
  ...common,
  key: "trello-close-board",
  name: "Close Board",
  description: "Closes a board.",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    boardId: {
      type: "string",
      label: "Board Id",
      description: "The ID of the Board to close.",
    },
  },
  methods: {
    ...common.methods,
  },
  async run() {
    const constraints = {
      boardId: {
        presence: true,
        format: {
          pattern: "^[0-9a-fA-F]{24}$",
          message: function (value) {
            return validate.format("^%{id} is not a valid Board id", {
              id: value,
            });
          },
        },
      },
    };
    const validationResult = validate(
      {
        boardId: this.boardId,
      },
      constraints,
    );
    this.checkValidationResults(validationResult);
    return await this.trello.closeBoard(this.boardId);
  },
};
