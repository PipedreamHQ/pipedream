const validate = require("validate.js");
const common = require("../common");

module.exports = {
  ...common,
  key: "trello-delete-checklist",
  name: "Delete Checklist",
  description: "Deletes the specified checklist.",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    idChecklist: {
      type: "string",
      label: "Id Checklist",
      description: "The ID of a checklist to delete. Must match pattern `^[0-9a-fA-F]{24}$`.",
    },
  },
  methods: {
    ...common.methods,
  },
  async run() {
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
    return await this.trello.deleteChecklist(this.idChecklist);
  },
};
