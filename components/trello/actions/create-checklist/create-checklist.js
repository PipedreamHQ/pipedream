const validate = require("validate.js");
const common = require("../common");

module.exports = {
  ...common,
  key: "trello-create-checklist",
  name: "Create Checklist",
  description: "Creates a checklist on the specified card.",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    idCard: {
      type: "string",
      label: "Id Card",
      description: "The ID of the Card that the checklist should be added to. Must match pattern `^[0-9a-fA-F]{24}$`.",
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the checklist. Should be a string of length 1 to 16384.",
      optional: true,
    },
    pos: {
      type: "string",
      label: "Position",
      description:
        "The position of the new checklist. Valid values: `top`, `bottom`, or a positive float.",
      optional: true,
    },
    idChecklistSource: {
      type: "string",
      label: "Id Checklist Source",
      description: "The ID of a checklist to copy into the new checklist. Must match pattern `^[0-9a-fA-F]{24}$`.",
      optional: true,
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
    if (this.name) {
      constraints.name = {
        length: {
          minimum: 1,
          maximum: 16384,
        },
      };
    }
    if (this.pos) {
      const posValidationMesssage =
      "contains invalid values. Valid values are: `top`, `bottom`, or a positive float.";
      if (validate.isNumber(this.pos)) {
        constraints.pos = {
          numericality: {
            greaterThanOrEqualTo: 0,
          },
          message: posValidationMesssage,
        };
      } else if (validate.isString(this.pos)) {
        const options = [
          "top",
          "bottom",
        ];
        validate.validators.posStringValidator = function (
          posString,
          options,
        ) {
          return options.includes(posString) ?
            null :
            posValidationMesssage;
        };
        constraints.pos = {
          posStringValidator: options,
        };
      }
    }
    if (this.idChecklistSource) {
      constraints.idChecklistSource = {
        format: {
          pattern: "^[0-9a-fA-F]{24}$",
          message: function (value) {
            return validate.format("^%{id} is not a valid Checklist Source id", {
              id: value,
            });
          },
        },
      };
    }
    const opts = {
      idCard: this.idCard,
      name: this.name,
      pos: this.pos,
      idChecklistSource: this.idChecklistSource,
    };
    const validationResult = validate(opts,
      constraints);
    this.checkValidationResults(validationResult);
    return await this.trello.createChecklist(opts);
  },
};
