import validate from "validate.js";
import common from "../common.js";

export default {
  ...common,
  key: "trello-create-checklist",
  name: "Create Checklist",
  description: "Creates a checklist on the specified card. [See the docs here](https://developer.atlassian.com/cloud/trello/rest/api-group-checklists/#api-checklists-post)",
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
      description: "The ID of the Card that the checklist should be added to",
      optional: false,
    },
    name: {
      propDefinition: [
        common.props.trello,
        "name",
      ],
      description: "The name of the checklist. Should be a string of length 1 to 16384.",
    },
    pos: {
      propDefinition: [
        common.props.trello,
        "pos",
      ],
      description: "The position of the new checklist. Valid values: `top`, `bottom`, or a positive float.",
    },
    idChecklistSource: {
      propDefinition: [
        common.props.trello,
        "checklist",
        (c) => ({
          board: c.board,
        }),
      ],
    },
  },
  async run({ $ }) {
    const constraints = {};
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
    const opts = {
      name: this.name,
      pos: this.pos,
    };
    const validationResult = validate(opts,
      constraints);
    this.checkValidationResults(validationResult);
    const res = await this.trello.createChecklist(opts, $);
    $.export("$summary", `Successfully created checklist ${res.name}`);
    return res;
  },
};
