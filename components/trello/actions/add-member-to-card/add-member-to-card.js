const validate = require("validate.js");
const common = require("../common");

module.exports = {
  ...common,
  key: "trello-add-member-to-card",
  name: "Add Member to Card",
  description: "Adds a member to the specified card.",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    idCard: {
      type: "string",
      label: "Id Card",
      description: "The ID of the Card to add the Member on. Must match pattern `^[0-9a-fA-F]{24}$`.",
    },
    idMember: {
      type: "string",
      label: "Id Member",
      description: "The ID of the Member to be added to the card.",
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
    return await this.trello.addMemberToCard(this.idCard, {
      value: this.idMember,
    });
  },
};
