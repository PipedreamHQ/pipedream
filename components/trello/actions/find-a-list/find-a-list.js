const validate = require("validate.js");
const common = require("../common");

module.exports = {
  ...common,
  key: "trello-find-a-list",
  name: "Find a List",
  description: "Enter action description here.",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    boardId: {
      type: "string",
      label: "From Board Id",
      description: "The ID of the board where the list may be found.",
    },
    name: {
      type: "string",
      label: "List Name",
      description: "Name of the list to find.",
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
      name: {
        presence: true,
      },
    };
    const opts = {
      boardId: this.boardId,
      name: this.name,
    };
    const validationResult = validate(opts,
      constraints);
    this.checkValidationResults(validationResult);
    return await this.trello.findList(opts);
  },
};
