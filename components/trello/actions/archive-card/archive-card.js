const validate = require("validate.js");
const common = require("../common");

module.exports = {
  ...common,
  key: "trello-archive-card",
  name: "Archive Card",
  description: "Archives a card.",
  version: "0.0.3",
  type: "action",
  props: {
    ...common.props,
    idCard: {
      type: "string",
      label: "Id Card",
      description: "The ID of the Card to archive.",
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
    };
    const validationResult = validate(
      {
        idCard: this.idCard,
      },
      constraints,
    );
    this.checkValidationResults(validationResult);
    return await this.trello.archiveCard(this.idCard);
  },
};
